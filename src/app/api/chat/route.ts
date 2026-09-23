import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { runBroker } from "@/lib/research/broker";
import { chatComplete, extractJson } from "@/lib/research/llm";
import { searchKnowledge } from "@/lib/research/rag-engine";
import {
  executePipeline,
  EventQueue,
} from "@/lib/research/pipeline";
import type {
  ChatRequest,
  ResearchMode,
  ResearchRequest,
  SSEEvent,
  SpeedMode,
} from "@/lib/types";
import { SPEED_PRESETS } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const ESSAY_CHAT_SYSTEM = `You are the research assistant of AI Researcher Pro. You answer questions about the user's completed research essay and its sources. Be substantive: give thorough, well-reasoned answers grounded in the essay, the sources, and the curated knowledge-base excerpts provided. Use markdown when helpful (headings, bold, lists). Cite web sources as [S1], [S2] and knowledge-base passages as [K1], [K2] when drawing on them. Never mention being an AI. Never give one-line answers to substantive questions — develop your reasoning.`;

const QUICK_CHAT_SYSTEM = `You are AI Researcher Pro — a world-class research assistant with access to a curated knowledge base of hundreds of verified reference passages. Answer the user's message directly, substantively and helpfully. Use markdown when helpful. If the user seems to want a long-form essay or deep investigation, tell them they can simply ask for a research essay or photo essay and you will run a full deep-research pipeline. Cite knowledge-base passages as [K1], [K2] when drawing on them. Never mention being an AI.`;

// ─── Intent classification ───────────────────────────────────────────────────

interface Intent {
  intent: "research" | "chat";
  mode: ResearchMode; // research kind
  topic: string;
}

function heuristicIntent(message: string): Intent {
  const m = message.toLowerCase();
  const words = m.split(/\s+/).filter(Boolean).length;
  const isPhoto =
    /photo\s?-? ?essay|photo story|with (?:\d+ )?photos|picture essay|visual narrative|photo series/.test(
      m
    );
  const researchy =
    /\b(essay|research|report|write|analy[sz]e|deep dive|explainer|documentary|detailed|in-depth|investigat|compare|history of|overview|case study|literature review|photo)\b/.test(
      m
    );
  const chatty =
    /^(hi|hii+|hey|hello|yo|sup|thanks|thank you|ok|okay|cool|nice|great|bye|good (morning|afternoon|evening|night))\b/.test(
      m.trim()
    ) || /\b(who are you|what can you do|how do you work|are you (an? )?(ai|bot|human))\b/.test(m);
  if (chatty && words <= 12) return { intent: "chat", mode: "essay", topic: "" };
  if (researchy || isPhoto || words >= 14) {
    return {
      intent: "research",
      mode: isPhoto ? "photo-essay" : "essay",
      topic: message.trim(),
    };
  }
  return { intent: "chat", mode: "essay", topic: "" };
}

async function classifyIntent(message: string): Promise<Intent> {
  // Reasoning models (like DeepSeek R1) take minutes to output simple JSON classifications
  // because they generate massive <think> blocks. We rely entirely on the heuristic 
  // so the UI feels snappy and the session starts immediately.
  return heuristicIntent(message);
}

// ─── KB-augmented quick reply (streamed as content events) ──────────────────

async function streamQuickReply(
  q: EventQueue,
  opts: {
    message: string;
    systemPrompt: string;
    history: { role: "user" | "assistant"; content: string }[];
    persist?: { sessionId: string };
  }
): Promise<void> {
  let kbBlock = "";
  try {
    const kbHits = await searchKnowledge(opts.message, { topK: 3 });
    if (kbHits.length > 0) {
      kbBlock =
        `\n\nKNOWLEDGE BASE excerpts (curated reference corpus — cite as [K1], [K2] when used):\n` +
        kbHits
          .map((h, i) => `K${i + 1}: ${h.title} [${h.domain}]\n${h.content}`)
          .join("\n\n");
    }
  } catch {
    /* chat works fine without KB augmentation */
  }

  const messages = [
    { role: "system" as const, content: opts.systemPrompt + kbBlock },
    ...opts.history.slice(-6).map((h) => ({
      role: h.role as "user" | "assistant",
      content: h.content.slice(0, 4000),
    })),
    { role: "user" as const, content: opts.message },
  ];

  const answer = await chatComplete(messages, {
    maxTokens: 2600,
    temperature: 0.55,
    minChars: 20,
  });

  // simulate streaming so the UI feels alive (SDK has no streaming)
  const tokens = answer.split(/(\s+)/);
  let buf = "";
  for (let i = 0; i < tokens.length; i++) {
    buf += tokens[i];
    if (i % 8 === 7 || i === tokens.length - 1) {
      q.push({ type: "content", text: buf });
      buf = "";
      await new Promise((r) => setTimeout(r, 24));
    }
  }

  if (opts.persist) {
    await db.chatMessage.create({
      data: { sessionId: opts.persist.sessionId, role: "user", content: opts.message },
    });
    await db.chatMessage.create({
      data: {
        sessionId: opts.persist.sessionId,
        role: "assistant",
        content: answer,
      },
    });
  }
}

// ─── Route ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {

  let body: ChatRequest;
  try {
    const rawBody = await req.json();
    if (rawBody.attachId) {
      const attachId = rawBody.attachId;
      const stream = new ReadableStream({
        start(controller) {
          if (!runBroker.attach(attachId, controller as any)) {
            controller.close();
          }
        },
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "X-Accel-Buffering": "no",
        },
      });
    }
    body = rawBody as ChatRequest;
  } catch {

    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message = (body.message ?? "").toString().trim();
  if (!message) {
    return Response.json({ error: "message is required" }, { status: 400 });
  }

  const speed: SpeedMode =
    body.speed && body.speed in SPEED_PRESETS ? body.speed : "fast";
  const history = Array.isArray(body.history) ? body.history : [];
  const sessionId = (body.sessionId ?? "").toString().trim();

  const queue = new EventQueue();
  const encoder = new TextEncoder();
  
  let currentSessionId: string | null = null;
  const originalPush = queue.push.bind(queue);
  queue.push = (ev) => {
    originalPush(ev);
    if (currentSessionId) {
      runBroker.push(currentSessionId, ev);
    }
  };

  const heartbeat = setInterval(() => {
    queue.push({ type: "heartbeat" });
  }, 9000);

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const evt = await queue.next();
      if (evt === null) {
        controller.close();
        return;
      }
      try {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(evt)}\n\n`));
      } catch {
        /* client gone */
      }
    },
    cancel() {
      clearInterval(heartbeat);
      queue.end();
    },
  });

  (async () => {
    let sessionTitle = message.slice(0, 90);
    try {
      if (sessionId) {
        // ── Follow-up inside an existing conversation ────────────────────
        const session = await db.researchSession.findUnique({
          where: { id: sessionId },
        });
        if (!session) {
          queue.push({
            type: "error",
            message: "Session not found — start a new chat.",
          });
          return;
        }
        sessionTitle = session.title ?? session.topic;

        let systemPrompt = QUICK_CHAT_SYSTEM;
        if (session.kind !== "chat" && session.markdown) {
          // research session with a finished essay → essay-grounded chat
          const sources = (() => {
            try {
              return JSON.parse(session.sourcesJson ?? "[]") as {
                id: string;
                title: string;
                url: string;
                snippet: string;
              }[];
            } catch {
              return [];
            }
          })();
          const sourcesBlock =
            sources.length > 0
              ? `\n\nSOURCES:\n${sources
                  .slice(0, 12)
                  .map((s) => `${s.id}: ${s.title} — ${s.url}\n  ${s.snippet}`)
                  .join("\n")}`
              : "";
          const essayBlock = `\n\nTHE ESSAY (topic: ${session.topic}):\n${session.markdown.slice(0, 24000)}`;
          systemPrompt = ESSAY_CHAT_SYSTEM + essayBlock + sourcesBlock;
        }

        await streamQuickReply(queue, {
          message,
          systemPrompt,
          history,
          persist: { sessionId: session.id },
        });
        queue.push({
          type: "done",
          sessionId: session.id,
          title: sessionTitle,
          kind: session.kind === "chat" ? "chat" : "research",
        });
      } else {
        // ── New conversation → classify intent ───────────────────────────
        const intent = await classifyIntent(message);
        queue.push({
          type: "intent",
          intent: intent.intent,
          mode: intent.mode,
        });

        if (intent.intent === "research") {
          // full deep-research pipeline (mode caps enforced inside)
          const researchReq: ResearchRequest = {
            topic: intent.topic.slice(0, 500) || message.slice(0, 500),
            mode: intent.mode,
            speed,
            useWeb: true,
          };
          const session = await db.researchSession.create({
            data: {
              topic: researchReq.topic,
              kind: "research",
              mode: researchReq.mode,
              depth: researchReq.speed,
              status: "running",
              title: message.slice(0, 90),
            },
          });
          currentSessionId = session.id;
          runBroker.startRun(session.id);
          await executePipeline(researchReq, queue, session.id);
          // executePipeline emits its own done event
        } else {
          const chatSession = await db.researchSession.create({

            data: {
              topic: message.slice(0, 200),
              kind: "chat",
              mode: "chat",
              depth: speed,
              status: "done",
              title: message.slice(0, 90),
            },
          });
          currentSessionId = chatSession.id;
          runBroker.startRun(chatSession.id);
          queue.push({
            type: "session",
            sessionId: chatSession.id,
            kind: "chat",
          });
          await streamQuickReply(queue, {
            message,
            systemPrompt: QUICK_CHAT_SYSTEM,
            history: [],
            persist: { sessionId: chatSession.id },
          });
          queue.push({
            type: "done",
            sessionId: chatSession.id,
            title: chatSession.title ?? message.slice(0, 90),
            kind: "chat",
          });
        }
      }
    } catch (e: any) {
      queue.push({
        type: "error",
        message: e instanceof Error ? e.message : String(e),
      });
    } finally {
      clearInterval(heartbeat);
      queue.end();
      if (currentSessionId) {
        runBroker.finishRun(currentSessionId);
      }
    }
  })();

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

export async function GET() {
  return Response.json({ error: "Use POST" }, { status: 405 });
}
