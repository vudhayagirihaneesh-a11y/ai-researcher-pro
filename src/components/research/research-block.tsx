"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  Download,
  FileText,
  FolderArchive,
  Globe,
  ImageIcon,
  Loader2,
  Terminal,
  TriangleAlert,
} from "lucide-react";
import type { ResearchMode } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EssayView } from "@/components/research/essay-view";
import { LiveLog } from "@/components/research/live-log";
import { PhotoGallery } from "@/components/research/photo-gallery";
import { SourcesList } from "@/components/research/sources-list";
import {
  MODE_LABELS,
  STAGES,
  STAGE_LABELS,
  countWords,
  formatElapsed,
  formatNumber,
  speedLabel,
  type ResearchRunState,
} from "@/components/research/utils";
import { cn } from "@/lib/utils";

function StatCell({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 flex-1 rounded-lg bg-gray-50 px-2.5 py-2 text-center dark:bg-stone-800/60">
      <p className="truncate text-sm leading-tight font-semibold text-gray-900 tabular-nums dark:text-stone-100">
        {value}
      </p>
      <p className="truncate text-[10px] leading-tight font-medium tracking-wide text-gray-400 uppercase dark:text-stone-500">
        {label}
      </p>
    </div>
  );
}

export function ResearchBlock({
  run,
  liveElapsedMs,
  onCancel,
}: {
  run: ResearchRunState;
  liveElapsedMs: number;
  onCancel: () => void;
}) {
  const [tab, setTab] = useState<"essay" | "photos" | "sources">("essay");
  const [logOpen, setLogOpen] = useState(false);

  const running = run.status === "running";
  const liveWords = Math.max(run.stats.words, countWords(run.markdown));
  const elapsed = running
    ? Math.max(run.stats.elapsedMs, liveElapsedMs)
    : run.stats.elapsedMs;
  const kbCount = run.sources.filter((s) => s.kind === "kb").length;
  const webCount = run.sources.filter((s) => s.kind !== "kb").length;
  const errored = run.status === "error";
  const cancelled = run.status === "cancelled";

  return (
    <div className="space-y-4">
      {/* ── Progress card ─────────────────────────────────────────────────── */}
      <div
        className={cn(
          "rounded-xl border bg-white shadow-sm dark:bg-stone-900",
          errored
            ? "border-red-300 dark:border-red-900"
            : "border-gray-200 dark:border-stone-700"
        )}
      >
        {/* Header row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 pt-3.5 pb-2">
          {running ? (
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-700 dark:text-blue-400">
              <Loader2 className="size-3.5 animate-spin" />
              Deep Research · {speedLabel(run.speed)}
            </span>
          ) : errored ? (
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-red-600 dark:text-red-400">
              <TriangleAlert className="size-3.5" />
              Research failed
            </span>
          ) : cancelled ? (
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-amber-700 dark:text-amber-400">
              <ChevronDown className="size-3.5" />
              Detached — still researching in the background
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-800 dark:text-stone-200">
              <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
              Research complete · {MODE_LABELS[run.mode]} ·{" "}
              {speedLabel(run.speed)}
            </span>
          )}
          <span className="text-xs text-gray-400 tabular-nums dark:text-stone-500">
            {formatElapsed(elapsed)}
          </span>
          {running && (
            <button
              type="button"
              onClick={onCancel}
              className="ml-auto rounded-md px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
            >
              Stop
            </button>
          )}
        </div>

        {/* Stage chips */}
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {STAGES.map((stage) => {
            const done = run.completedStages.includes(stage);
            const current = run.currentStage === stage;
            if (!done && !current && !running) return null;
            return (
              <span
                key={stage}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium",
                  done
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                    : current
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400"
                      : "bg-gray-100 text-gray-400 dark:bg-stone-800 dark:text-stone-500"
                )}
              >
                {done ? (
                  <Check className="size-3" />
                ) : current ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : null}
                {STAGE_LABELS[stage]}
              </span>
            );
          })}
        </div>

        {/* Current activity */}
        {(running || errored || cancelled) && (
          <p
            className={cn(
              "border-t border-gray-100 px-4 py-2.5 text-xs leading-relaxed dark:border-stone-800",
              errored
                ? "text-red-600 dark:text-red-400"
                : "text-gray-500 dark:text-stone-400"
            )}
          >
            {errored
              ? run.error
              : cancelled
                ? "Research stopped."
                : (run.currentStage && run.stageMessages[run.currentStage]) ||
                  "Working…"}
          </p>
        )}

        {/* Stats */}
        <div className="flex gap-2 border-t border-gray-100 px-3 py-3 dark:border-stone-800">
          <StatCell label="Words" value={formatNumber(liveWords)} />
          <StatCell label="KB hits" value={formatNumber(kbCount)} />
          <StatCell label="Sources" value={formatNumber(webCount)} />
          <StatCell label="Photos" value={formatNumber(run.images.length)} />
        </div>

        {/* Live log toggle */}
        {run.logLines.length > 0 && (
          <div className="border-t border-gray-100 dark:border-stone-800">
            <button
              type="button"
              onClick={() => setLogOpen((o) => !o)}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-gray-500 transition-colors hover:text-gray-800 dark:text-stone-400 dark:hover:text-stone-200"
              aria-expanded={logOpen}
            >
              <Terminal className="size-3.5" />
              {logOpen ? "Hide" : "View"} live research log ({
                run.logLines.length
              })
              <ChevronDown
                className={cn(
                  "ml-auto size-3.5 transition-transform",
                  logOpen && "rotate-180"
                )}
              />
            </button>
            {logOpen && (
              <div className="px-3 pb-3">
                <LiveLog lines={run.logLines} running={running} />
              </div>
            )}
          </div>
        )}
      </div>

      {errored && (
        <div className="rounded-xl border border-red-200 bg-red-50/70 px-4 py-3 text-sm leading-relaxed text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          {run.error ?? "The research pipeline failed."} The topic may work on
          retry — or try rephrasing it.
        </div>
      )}

      {/* ── Result tabs ───────────────────────────────────────────────────── */}
      {(run.markdown.trim().length > 0 || run.images.length > 0) && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900">
          <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 px-2 pt-2 dark:border-stone-800">
            {(
              [
                ["essay", "Essay", FileText],
                ["photos", `Photos${run.images.length ? ` · ${run.images.length}` : ""}`, ImageIcon],
                ["sources", `Sources${run.sources.length ? ` · ${run.sources.length}` : ""}`, Globe],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-t-lg border-b-2 px-3 py-2 text-[13px] font-medium transition-colors",
                  tab === key
                    ? "border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-800 dark:text-stone-400 dark:hover:text-stone-200"
                )}
              >
                <Icon className="size-3.5" />
                {label}
              </button>
            ))}
            {run.sessionId && !running && (
              <div className="ml-auto flex items-center gap-1.5 pb-1.5 pr-1">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 px-2.5 text-xs text-gray-600 hover:text-gray-900 dark:text-stone-300 dark:hover:text-stone-100"
                >
                  <a href={`/api/export?sessionId=${run.sessionId}&format=md`}>
                    <FileText className="size-3.5" />
                    MD
                  </a>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 px-2.5 text-xs text-gray-600 hover:text-gray-900 dark:text-stone-300 dark:hover:text-stone-100"
                >
                  <a href={`/api/export?sessionId=${run.sessionId}&format=html`}>
                    <Download className="size-3.5" />
                    HTML
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.print()}
                  className="h-8 gap-1.5 px-2.5 text-xs text-gray-600 hover:text-gray-900 dark:text-stone-300 dark:hover:text-stone-100"
                >
                  <FileText className="size-3.5" />
                  PDF
                </Button>
              </div>
            )}
          </div>
          <div className="px-4 py-4 sm:px-5 sm:py-5">
            {tab === "essay" && (
              <EssayView markdown={run.markdown} running={running} />
            )}
            {tab === "photos" && (
              <PhotoGallery
                images={run.images}
                placeholder={run.imageProgress}
                mode={run.mode}
                sessionId={run.sessionId}
              />
            )}
            {tab === "sources" && <SourcesList sources={run.sources} />}
          </div>
        </div>
      )}

      {/* Summary line once done (when result area is tabbed away) */}
      {!running && run.status !== "error" && run.status !== "cancelled" && (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400 dark:text-stone-500">
          <Badge
            variant="outline"
            className="border-gray-200 text-[10px] text-gray-500 dark:border-stone-700 dark:text-stone-400"
          >
            {speedLabel(run.speed)}
          </Badge>
          {formatNumber(run.stats.words)} words ·{" "}
          {run.images.length} photos · {webCount} web sources · {kbCount} KB
          passages · {formatElapsed(run.stats.elapsedMs)}
        </p>
      )}
    </div>
  );
}
