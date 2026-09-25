"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Library, Menu } from "lucide-react";
import { toast } from "sonner";
import type {
  PipelineStage,
  ResearchMode,
  SessionDetail,
  SessionListItem,
  SpeedMode,
  SSEEvent,
} from "@/lib/types";
import { SPEED_PRESETS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarContent } from "@/components/research/app-sidebar";
import { ChatMessageView } from "@/components/research/chat-message";
import { Composer } from "@/components/research/composer";
import { KnowledgeExplorer } from "@/components/research/knowledge-explorer";
import { ThemeToggle } from "@/components/research/theme-toggle";
import { WelcomeHero } from "@/components/research/welcome-hero";
import { isAbortError, streamSSE } from "@/components/research/sse-client";
import {
  STAGES,
  EMPTY_STATS,
  type ChatMsg,
  type ResearchRunState,
} from "@/components/research/utils";

let msgIdCounter = 0;
const nextMsgId = () => `m${++msgIdCounter}`;

function makeResearchState(
  topic: string,
  speed: SpeedMode,
  mode: ResearchMode
): ResearchRunState {
  return {
    status: "running",
    speed,
    mode,
    topic,
    currentStage: null,
    completedStages: [],
    stageMessages: {},
    plan: null,
    logLines: [],
    sources: [],
    images: [],
    imageProgress: null,
    sectionProgress: null,
    markdown: "",
    stats: { ...EMPTY_STATS },
    title: null,
    sessionId: null,
    error: null,
    startedAt: Date.now(),
  };
}

export default function Home() {
  // ── Chat state ────────────────────────────────────────────────────────────
  const [sessionMessages, setSessionMessages] = useState<Record<string, ChatMsg[]>>({});
  const [sessionInputs, setSessionInputs] = useState<Record<string, string>>({});
  const [speed, setSpeed] = useState<SpeedMode>("fast");
  const [sessionStreaming, setSessionStreaming] = useState<Record<string, boolean>>({});

  // ── History / sessions ────────────────────────────────────────────────────
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string>("new");

  const messages = sessionMessages[activeSessionId] || [];
  const input = sessionInputs[activeSessionId] || "";
  const streaming = sessionStreaming[activeSessionId] || false;
  const setInput = (val: string) => setSessionInputs(prev => ({ ...prev, [activeSessionId]: val }));

  // ── Chrome ────────────────────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const abortRefs = useRef<Record<string, AbortController>>({});
  const activeSessionRef = useRef<string>("new");
  const speedRef = useRef<SpeedMode>(speed);
  const logIdRef = useRef(0);
  const stickBottomRef = useRef(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const setActiveSession = useCallback((id: string) => {
    activeSessionRef.current = id;
    setActiveSessionId(id);
  }, []);

  // ── Per-second tick while streaming (elapsed timers) ─────────────────────
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!streaming) return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [streaming]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    stickBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < 140;
  }, []);

  // ── Sessions ──────────────────────────────────────────────────────────────
  const refreshSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const res = await fetch("/api/sessions");
      if (res.ok) {
        const data = (await res.json()) as { sessions?: SessionListItem[] };
        setSessions(data.sessions ?? []);
      }
    } catch {
      // History is non-critical — fail silently.
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSessions();
  }, [refreshSessions]);

  // ── Immutable message helpers ─────────────────────────────────────────────
  const updateMessage = useCallback(
    (streamId: string, fn: (msg: ChatMsg) => ChatMsg) => {
      setSessionMessages((prev) => {
        const arr = prev[streamId];
        if (!arr || arr.length === 0) return prev;
        const next = [...arr];
        next[next.length - 1] = fn(next[next.length - 1]);
        return { ...prev, [streamId]: next };
      });
    },
    []
  );

  const pushLog = useCallback(
    (streamId: string, text: string) => {
      updateMessage(streamId, (msg) => {
        if (msg.kind !== "research" || !msg.research) return msg;
        return {
          ...msg,
          research: {
            ...msg.research,
            logLines: [
              ...msg.research.logLines.slice(-400),
              { id: ++logIdRef.current, text },
            ],
          },
        };
      });
    },
    [updateMessage]
  );

  const updateResearch = useCallback(
    (streamId: string, fn: (run: ResearchRunState) => ResearchRunState) => {
      updateMessage(streamId, (msg) => {
        if (msg.kind !== "research" || !msg.research) return msg;
        return { ...msg, research: fn(msg.research) };
      });
    },
    [updateMessage]
  );

  // ── SSE event routing ─────────────────────────────────────────────────────
  const handleEvent = useCallback(
    (localStreamId: string, raw: unknown) => {
      const ev = raw as SSEEvent;
      switch (ev.type) {
        case "heartbeat":
          break;

        case "intent": {
          if (ev.intent === "research") {
            // The assistant message becomes a research message.
            updateMessage(localStreamId, (msg) => {
              if (msg.role !== "assistant") return msg;
              const topic = msg.content || "your topic";
              return {
                ...msg,
                kind: "research",
                content: "",
                research: makeResearchState(
                  topic,
                  speedRef.current,
                  ev.mode === "photo-essay" ? "photo-essay" : "essay"
                ),
              };
            });
          } else {
            updateMessage(localStreamId, (msg) =>
              msg.role === "assistant" ? { ...msg, kind: "chat" } : msg
            );
          }
          break;
        }

        case "session": {
          setSessionMessages((prev) => {
            if (localStreamId === ev.sessionId) return prev;
            const m = prev[localStreamId] || [];
            const next = { ...prev };
            delete next[localStreamId];
            next[ev.sessionId] = m;
            return next;
          });
          setSessionStreaming((prev) => {
            const s = prev[localStreamId];
            const next = { ...prev };
            delete next[localStreamId];
            if (s !== undefined) next[ev.sessionId] = s;
            return next;
          });
          if (abortRefs.current[localStreamId]) {
            abortRefs.current[ev.sessionId] = abortRefs.current[localStreamId];
            delete abortRefs.current[localStreamId];
          }
          if (activeSessionRef.current === localStreamId) {
            setActiveSession(ev.sessionId);
          }
          void refreshSessions();
          break;
        }

        case "stage": {
          const idx = STAGES.indexOf(ev.stage);
          updateResearch(localStreamId, (run) => ({
            ...run,
            currentStage: ev.stage,
            completedStages: STAGES.slice(0, Math.max(idx, 0)),
            stageMessages: { ...run.stageMessages, [ev.stage]: ev.message },
          }));
          pushLog(localStreamId, `── ${ev.message}`);
          break;
        }

        case "stage_detail":
          pushLog(localStreamId, ev.message);
          break;

        case "plan":
          updateResearch(localStreamId, (run) => ({
            ...run,
            plan: {
              title: ev.title,
              queries: ev.queries,
              outline: ev.outline,
            },
            title: ev.title,
          }));
          pushLog(localStreamId, `Title: "${ev.title}"`);
          ev.queries.forEach((q) => pushLog(localStreamId, `  query · ${q}`));
          pushLog(localStreamId, 
            `Outline: ${ev.outline.length} sections (~${ev.outline.reduce((a, s) => a + s.targetWords, 0).toLocaleString()} words)`
          );
          void refreshSessions();
          break;

        case "search_result":
          pushLog(localStreamId, 
            `search · "${ev.query}" → ${ev.count} results`
          );
          break;

        case "kb_result":
          pushLog(localStreamId, 
            `kb · "${ev.query}" → ${ev.count} passages${ev.best ? ` · best: ${ev.best}` : ""}`
          );
          break;

        case "kb_learned":
          pushLog(localStreamId, 
            `+ ${ev.count} passage${ev.count === 1 ? "" : "s"} auto-learned — knowledge base now ${ev.total}`
          );
          break;

        case "source_read":
          pushLog(localStreamId, 
            `read · ${ev.title} (${ev.chars.toLocaleString()} chars)`
          );
          break;

        case "sources":
          updateResearch(localStreamId, (run) => ({
            ...run,
            sources: ev.sources,
          }));
          pushLog(localStreamId, 
            `Collected ${ev.sources.length} sources`
          );
          break;

        case "image_start":
          updateResearch(localStreamId, (run) => ({
            ...run,
            imageProgress: {
              index: ev.index,
              total: ev.total,
              prompt: ev.prompt,
            },
          }));
          break;

        case "image_done":
          updateResearch(localStreamId, (run) => ({
            ...run,
            images: [...run.images, ev.image],
            imageProgress: null,
          }));
          pushLog(localStreamId, 
            `image ${ev.image.order + 1} ready · ${ev.image.credit}`
          );
          break;

        case "section_start":
          updateResearch(localStreamId, (run) => ({
            ...run,
            sectionProgress: {
              heading: ev.heading,
              index: ev.index,
              total: ev.total,
            },
          }));
          pushLog(localStreamId, 
            `writing · ${ev.heading} (${ev.index}/${ev.total})`
          );
          break;

        case "content": {
          const chunk = ev.text;
          updateMessage(localStreamId, (msg) => {
            if (msg.role !== "assistant") return msg;
            if (msg.kind === "research" && msg.research) {
              return {
                ...msg,
                research: {
                  ...msg.research,
                  markdown: msg.research.markdown + chunk,
                },
              };
            }
            return { ...msg, content: msg.content + chunk };
          });
          break;
        }

        case "section_done":
          updateResearch(localStreamId, (run) => ({
            ...run,
            sectionProgress: null,
          }));
          pushLog(localStreamId, `✓ ${ev.heading} · ${ev.words} words`);
          break;

        case "expansion":
          pushLog(localStreamId, `↻ ${ev.message}`);
          break;

        case "stats":
          updateResearch(localStreamId, (run) => ({
            ...run,
            stats: {
              ...run.stats,
              words: ev.words,
              elapsedMs: ev.elapsedMs,
            },
          }));
          break;

        case "done": {
          if (ev.kind === "research" && ev.markdown !== undefined) {
            updateResearch(localStreamId, (run) => ({
              ...run,
              status: "done",
              sessionId: ev.sessionId,
              title: ev.title,
              markdown: ev.markdown ?? run.markdown,
              images: ev.images ?? run.images,
              sources: ev.sources ?? run.sources,
              stats: ev.stats ?? run.stats,
              completedStages: STAGES,
              currentStage: null,
              sectionProgress: null,
              imageProgress: null,
            }));
            const s = ev.stats;
            toast.success("Research complete", {
              description: `${ev.title} — ${s ? `${s.words.toLocaleString()} words` : "done"}, ${ev.images?.length ?? 0} photos, ${ev.sources?.filter((x) => x.kind !== "kb").length ?? 0} web sources.`,
            });
          } else {
            // chat done — mark message settled (no-op content-wise)
            updateMessage(localStreamId, (msg) => msg);
          }
          void refreshSessions();
          break;
        }

        case "error": {
          updateMessage(localStreamId, (msg) => {
            if (msg.kind === "research" && msg.research) {
              return {
                ...msg,
                research: { ...msg.research, status: "error", error: ev.message },
              };
            }
            return msg.content === ""
              ? { ...msg, content: `⚠️ ${ev.message}` }
              : msg;
          });
          toast.error("Something went wrong", { description: ev.message });
          break;
        }
      }
    },
    [
      pushLog,
      refreshSessions,
      setActiveSession, setSessionMessages, setSessionStreaming,
      updateMessage,
      updateResearch,
    ]
  );

  // ── Send a message ────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text?: string) => {
      const localStreamId = activeSessionRef.current;
      const trimmed = (text ?? sessionInputs[localStreamId] ?? "").trim();
      if (!trimmed || abortRefs.current[localStreamId]) return;

      const history = messages
        .filter((m) => m.kind === "chat" || m.role === "user")
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

      const now = Date.now();
      setSessionMessages((prev) => { const arr = prev[localStreamId] || []; return { ...prev, [localStreamId]: [
        ...arr,
        {
          id: nextMsgId(),
          role: "user",
          kind: "chat",
          content: trimmed,
          createdAt: now,
        },
        {
          id: nextMsgId(),
          role: "assistant",
          kind: "pending",
          content: "",
          createdAt: now,
        },
      ] };
      });
      setSessionInputs(prev => ({...prev, [localStreamId]: ""}));
      stickBottomRef.current = true;
      setSessionStreaming(prev => ({...prev, [localStreamId]: true}));

      const controller = new AbortController();
      abortRefs.current[localStreamId] = controller;

      const sessionId = activeSessionRef.current === 'new' ? undefined : activeSessionRef.current;
      // Starting a new topic inside an old conversation: keep the session
      // only if it exists — the server handles research/chat accordingly.

      let targetStreamId = localStreamId;
      try {
        await streamSSE(
          "/api/chat",
          {
            message: trimmed,
            sessionId,
            speed: speedRef.current,
            history,
          },
          controller.signal,
          (raw) => {
            handleEvent(targetStreamId, raw);
            const ev = raw as SSEEvent;
            if (ev.type === "session" && ev.sessionId) {
              targetStreamId = ev.sessionId;
            }
          }
        );
        // Stream ended — settle any still-pending message.
        updateMessage(targetStreamId, (msg) => {
          if (msg.role !== "assistant") return msg;
          if (msg.kind === "pending") {
            return {
              ...msg,
              kind: "chat",
              content:
                msg.content || "*(empty response — please try again)*",
            };
          }
          if (
            msg.kind === "research" &&
            msg.research &&
            msg.research.status === "running"
          ) {
            return {
              ...msg,
              research: { ...msg.research, status: "cancelled" },
            };
          }
          return msg;
        });
      } catch (err) {
        if (isAbortError(err)) {
          // User pressed stop.
          updateMessage(targetStreamId, (msg) => {
            if (msg.role !== "assistant") return msg;
            if (msg.kind === "research" && msg.research) {
              return {
                ...msg,
                research: { ...msg.research, status: "cancelled" },
              };
            }
            return msg;
          });
          toast("Stopped", {
            description:
              "Research keeps running in the background — the finished essay will appear in History.",
          });
        } else {
          const message =
            err instanceof Error ? err.message : "Unknown error";
          updateMessage(targetStreamId, (msg) => {
            if (msg.role !== "assistant") return msg;
            if (msg.kind === "research" && msg.research) {
              return {
                ...msg,
                research: { ...msg.research, status: "error", error: message },
              };
            }
            return { ...msg, kind: "chat", content: `⚠️ ${message}` };
          });
          toast.error("Request failed", { description: message });
        }
      } finally {
        if (abortRefs.current[targetStreamId] === controller) delete abortRefs.current[targetStreamId];
        setSessionStreaming(prev => ({...prev, [targetStreamId]: false}));
        void refreshSessions();
      }
    },
    [
      handleEvent,
      sessionInputs, sessionMessages, refreshSessions, updateMessage,
    ]
  );

  const stopStreaming = useCallback(() => {
    const id = activeSessionRef.current;
    if (abortRefs.current[id]) {
      abortRefs.current[id].abort();
      delete abortRefs.current[id];
      setSessionStreaming(prev => ({...prev, [id]: false}));
    }
  }, []);

  const attachToStream = useCallback(async (id: string) => {
    if (abortRefs.current[id]) return; // already streaming
    
    const controller = new AbortController();
    abortRefs.current[id] = controller;
    setSessionStreaming(prev => ({...prev, [id]: true}));
    
    try {
      await streamSSE(
        "/api/chat",
        { attachId: id } as any,
        controller.signal,
        (raw) => handleEvent(id, raw)
      );
      // stream finished
      updateMessage(id, (msg) => {
        if (msg.role !== "assistant") return msg;
        if (msg.kind === "pending") {
          return { ...msg, kind: "chat", content: msg.content || "*(empty response)*" };
        }
        if (msg.kind === "research" && msg.research && msg.research.status === "running") {
           return { ...msg, research: { ...msg.research, status: "cancelled" } };
        }
        return msg;
      });
    } catch (err) {
      // ignore aborts or attach failures (meaning it wasn't running in memory)
    } finally {
      if (abortRefs.current[id] === controller) delete abortRefs.current[id];
      setSessionStreaming(prev => ({...prev, [id]: false}));
      void refreshSessions();
    }
  }, [handleEvent, refreshSessions, updateMessage]);

  // ── History: load / delete / new chat ────────────────────────────────────
  const loadSession = useCallback(
    async (id: string) => {
      setLoadingSessionId(id);
      try {
        if (abortRefs.current[id]) {
          // The session is actively streaming in memory! 
          // Just switch to it without fetching stale DB state.
          setActiveSession(id);
          stickBottomRef.current = true;
          requestAnimationFrame(() => {
            const el = scrollRef.current;
            if (el) el.scrollTop = el.scrollHeight;
          });
          return;
        }

        const res = await fetch(`/api/sessions/${id}`);
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        const detail = (await res.json()) as SessionDetail;

        const loaded: ChatMsg[] = [];
        if (detail.kind === "chat") {
          for (const m of detail.messages) {
            loaded.push({
              id: m.id,
              role: m.role === "user" ? "user" : "assistant",
              kind: "chat",
              content: m.content,
              createdAt: new Date(m.createdAt).getTime(),
            });
          }
          if (loaded.length === 0) {
            loaded.push({
              id: nextMsgId(),
              role: "user",
              kind: "chat",
              content: detail.topic,
              createdAt: new Date(detail.createdAt).getTime(),
            });
          }
        } else {
          // Research session: user topic → assistant research block → follow-ups
          loaded.push({
            id: nextMsgId(),
            role: "user",
            kind: "chat",
            content: detail.topic,
            createdAt: new Date(detail.createdAt).getTime(),
          });
          loaded.push({
            id: nextMsgId(),
            role: "assistant",
            kind: "research",
            content: "",
            createdAt: new Date(detail.createdAt).getTime() + 1,
            research: {
              status:
                detail.status === "done"
                  ? "done"
                  : detail.status === "error"
                    ? "error"
                    : "cancelled",
              speed: (["fast", "medium", "max"] as const).includes(
                detail.depth as SpeedMode
              )
                ? (detail.depth as SpeedMode)
                : "fast",
              mode: detail.mode === "photo-essay" ? "photo-essay" : "essay",
              topic: detail.topic,
              currentStage: null,
              completedStages: detail.status === "done" ? STAGES : [],
              stageMessages: {},
              plan: null,
              logLines: [],
              sources: detail.sources ?? [],
              images: detail.images ?? [],
              imageProgress: null,
              sectionProgress: null,
              markdown: detail.markdown ?? "",
              stats: {
                ...EMPTY_STATS,
                words: detail.wordCount,
                imagesGenerated: detail.images?.length ?? 0,
                sourcesRead:
                  detail.sources?.filter((s) => s.kind !== "kb").length ?? 0,
                kbHits:
                  detail.sources?.filter((s) => s.kind === "kb").length ?? 0,
              },
              title: detail.title,
              sessionId: detail.id,
              error: null,
              startedAt: new Date(detail.createdAt).getTime(),
            },
          });
          for (const m of detail.messages) {
            loaded.push({
              id: m.id,
              role: m.role === "user" ? "user" : "assistant",
              kind: "chat",
              content: m.content,
              createdAt: new Date(m.createdAt).getTime(),
            });
          }
        }


        setSessionMessages(prev => ({...prev, [detail.id]: loaded}));
        setActiveSession(detail.id);
        stickBottomRef.current = true;
        requestAnimationFrame(() => {
          const el = scrollRef.current;
          if (el) el.scrollTop = el.scrollHeight;
        });

        if (detail.status === "running") {
          // Re-attach to the live stream if it's still in memory
          void attachToStream(detail.id);
        }

      } catch (err) {
        toast.error("Could not load conversation", {
          description: err instanceof Error ? err.message : String(err),
        });
      } finally {
        setLoadingSessionId(null);
      }
    },
    [setActiveSession, attachToStream]
  );

  const deleteSession = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/sessions/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(`Delete failed (${res.status})`);
        setSessions((prev) => prev.filter((s) => s.id !== id));
        if (activeSessionRef.current === id) {
          setActiveSession("new");
          setSessionMessages(prev => { const next = {...prev}; delete next[id]; return next; });
        }
        toast.success("Conversation deleted");
      } catch (err) {
        toast.error("Could not delete conversation", {
          description: err instanceof Error ? err.message : String(err),
        });
      }
    },
    [setActiveSession]
  );

  const newChat = useCallback(() => {
    
    
    setActiveSession("new");
    setSidebarOpen(false);
    stickBottomRef.current = true;
  }, [setActiveSession]);

  // ── Live elapsed for a running research message ───────────────────────────
  const runningResearch = messages.find(
    (m) => m.kind === "research" && m.research?.status === "running"
  );
  const liveElapsedMs = runningResearch?.research
    ? Math.max(
        runningResearch.research.stats.elapsedMs,
        Date.now() - runningResearch.research.startedAt
      )
    : 0;

  const preset = SPEED_PRESETS[speed];

  return (
    <div className="flex h-dvh overflow-hidden bg-white text-gray-900 dark:bg-stone-950 dark:text-stone-100">
      {/* Desktop sidebar */}
      <aside className="hidden w-[272px] shrink-0 border-r border-gray-200 lg:block dark:border-stone-800">
        <SidebarContent
          sessions={sessions}
          activeId={activeSessionId}
          loadingId={loadingSessionId}
          onNewChat={newChat}
          onSelect={(id) => void loadSession(id)}
          onDelete={(id) => void deleteSession(id)}
        />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          aria-describedby={undefined}
          className="w-[290px] gap-0 border-gray-200 p-0 dark:border-stone-800"
        >
          <SheetTitle className="sr-only">Chat history</SheetTitle>
          <SidebarContent
            sessions={sessions}
            activeId={activeSessionId}
            loadingId={loadingSessionId}
            onNewChat={newChat}
            onSelect={(id) => {
              setSidebarOpen(false);
              void loadSession(id);
            }}
            onDelete={(id) => void deleteSession(id)}
          />
        </SheetContent>
      </Sheet>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-2.5 border-b border-gray-200 bg-white/85 px-3 backdrop-blur-md sm:px-4 dark:border-stone-800 dark:bg-stone-950/85">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="size-9 text-gray-600 lg:hidden dark:text-stone-300"
            aria-label="Open history menu"
          >
            <Menu className="size-5" />
          </Button>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <Bot className="size-4.5" />
          </span>
          <h1 className="truncate text-[15px] font-semibold tracking-tight">
            AI Researcher
          </h1>
          <span className="hidden truncate text-xs text-gray-400 sm:block dark:text-stone-500">
            {preset.label} mode · {preset.tagline}
          </span>

          <div className="ml-auto flex items-center gap-1.5">
            <span className="hidden items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 sm:inline-flex dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Connected
            </span>
            <ThemeToggle />
          </div>
        </header>

        {/* Chat scroll area */}
        <main
          ref={scrollRef}
          onScroll={handleScroll}
          className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]"
          aria-label="Conversation"
        >
          {messages.length === 0 ? (
            <WelcomeHero
              onPick={(topic) => {
                void sendMessage(topic);
              }}
            />
          ) : (
            <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 sm:px-6">
              {messages.map((m) => (
                <ChatMessageView
                  key={m.id}
                  msg={m}
                  liveElapsedMs={liveElapsedMs}
                  onCancelResearch={stopStreaming}
                />
              ))}
              <div className="h-2" />
            </div>
          )}
        </main>

        {/* Composer */}
        <Composer
          value={input}
          onChange={setInput}
          onSend={(override) => void sendMessage(override)}
          onStop={stopStreaming}
          running={streaming}
          speed={speed}
          onSpeedChange={setSpeed}
        />
      </div>

      {/* Knowledge base explorer */}
      <KnowledgeExplorer open={knowledgeOpen} onOpenChange={setKnowledgeOpen} />
    </div>
  );
}
