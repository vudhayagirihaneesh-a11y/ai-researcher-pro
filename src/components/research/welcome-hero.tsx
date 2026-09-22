"use client";

import { useEffect, useState } from "react";
import { Bot, Camera, Sparkles, Telescope } from "lucide-react";
import { Button } from "@/components/ui/button";

const EXAMPLES: { label: string; icon: typeof Telescope }[] = [
  {
    label: "Photo essay on the CJP student protest in Delhi",
    icon: Camera,
  },
  {
    label: "The right to peaceful protest in India",
    icon: Telescope,
  },
  {
    label: "Jantar Mantar and the history of protest in Delhi",
    icon: Sparkles,
  },
];

export function WelcomeHero({ onPick }: { onPick: (topic: string) => void }) {
  const [kbTotal, setKbTotal] = useState<number | null>(null);
  const [kbDomains, setKbDomains] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/knowledge/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setKbTotal(data.total ?? 0);
        setKbDomains(data.domains?.length ?? 0);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-10 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
        <Bot className="size-7" />
      </span>
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-stone-50">
        Where should we research today?
      </h1>
      <p className="mt-2.5 max-w-md text-sm leading-relaxed text-gray-500 dark:text-stone-400">
        Ask anything — quick questions get instant answers, and research
        requests run a full deep-research pipeline with real sources, photos
        you can download, and a knowledge base of{" "}
        {kbTotal !== null ? kbTotal.toLocaleString() : "hundreds of"} curated
        passages.
      </p>

      <div className="mt-7 grid w-full max-w-xl gap-2.5 sm:grid-cols-1">
        {EXAMPLES.map((ex) => (
          <Button
            key={ex.label}
            variant="outline"
            onClick={() => onPick(ex.label)}
            className="h-auto justify-start gap-3 rounded-xl border-gray-200 bg-white px-4 py-3.5 text-left text-[13.5px] font-normal text-gray-700 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-800 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-blue-700 dark:hover:bg-blue-950/30 dark:hover:text-blue-300"
          >
            <ex.icon className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
            {ex.label}
          </Button>
        ))}
      </div>

      <p className="mt-8 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-xs text-gray-400 dark:text-stone-500">
        {kbTotal !== null && kbDomains !== null && (
          <>
            <span className="font-medium text-gray-500 tabular-nums dark:text-stone-400">
              {kbTotal.toLocaleString()}
            </span>
            knowledge passages
            <span aria-hidden="true">·</span>
            <span className="font-medium text-gray-500 tabular-nums dark:text-stone-400">
              {kbDomains}
            </span>
            domains
            <span aria-hidden="true">·</span>
          </>
        )}
        Fast / Medium / Max research modes with 20k–100k word caps
      </p>
    </div>
  );
}
