"use client";

import { BookMarked, ExternalLink, Library } from "lucide-react";
import type { SourceDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

function hostname(url: string): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function SourcesList({ sources }: { sources: SourceDTO[] }) {
  const kbSources = sources.filter((s) => s.kind === "kb");
  const webSources = sources.filter((s) => s.kind !== "kb");

  if (sources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-stone-300 py-16 text-center dark:border-stone-700">
        <Library className="size-8 text-stone-300 dark:text-stone-600" />
        <p className="max-w-xs text-sm text-stone-500 dark:text-stone-400">
          Sources and knowledge-base passages will be listed here once the
          research pipeline runs.
        </p>
      </div>
    );
  }

  const summaryParts: string[] = [];
  if (webSources.length > 0) {
    summaryParts.push(
      `${webSources.length} ${webSources.length === 1 ? "web source" : "web sources"}`,
    );
  }
  if (kbSources.length > 0) {
    summaryParts.push(
      `${kbSources.length} knowledge-base ${kbSources.length === 1 ? "passage" : "passages"}`,
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-stone-500 dark:text-stone-400">
        <span className="font-medium text-stone-700 dark:text-stone-200">
          {sources.length}
        </span>{" "}
        {sources.length === 1 ? "item" : "items"} consulted during research —{" "}
        {summaryParts.join(" · ")}
      </p>
      <ol className="space-y-2.5">
        {[...kbSources, ...webSources].map((source) => {
          const isKb = source.kind === "kb";
          return (
            <li
              key={source.id}
              className={cn(
                "group flex gap-3 rounded-xl border p-3.5 transition-colors",
                isKb
                  ? "border-emerald-200/80 bg-emerald-50/50 hover:border-emerald-300 hover:bg-emerald-50/80 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:hover:border-emerald-800/60 dark:hover:bg-emerald-950/30"
                  : "border-stone-200 bg-white/70 hover:border-blue-300/70 hover:bg-blue-50/40 dark:border-stone-800 dark:bg-stone-900/50 dark:hover:border-blue-800/50 dark:hover:bg-blue-950/20",
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-semibold",
                  isKb
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
                )}
              >
                {source.id}
              </span>
              <div className="min-w-0 flex-1">
                {isKb ? (
                  <span className="flex items-start gap-1.5 text-sm font-medium text-stone-800 dark:text-stone-100">
                    <span className="leading-snug">{source.title}</span>
                  </span>
                ) : (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-start gap-1.5 text-sm font-medium text-stone-800 transition-colors group-hover:text-blue-800 dark:text-stone-100 dark:group-hover:text-blue-300"
                  >
                    <span className="leading-snug">{source.title}</span>
                    <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-stone-400 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </a>
                )}
                {source.snippet && (
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                    {source.snippet}
                  </p>
                )}
                <p className="mt-1.5 flex items-center gap-1.5 truncate font-mono text-[10px] tracking-wide text-stone-400 uppercase">
                  {isKb ? (
                    <>
                      <BookMarked className="size-3 shrink-0 text-emerald-500 dark:text-emerald-400" />
                      <span className="truncate normal-case">
                        knowledge base · {source.domain ?? "curated"}
                      </span>
                    </>
                  ) : (
                    hostname(source.url)
                  )}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
