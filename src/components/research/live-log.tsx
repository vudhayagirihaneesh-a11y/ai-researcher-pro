"use client";

import { useEffect, useRef } from "react";
import type { LogLine } from "@/components/research/utils";

const SCROLLBAR =
  "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-stone-700 [&::-webkit-scrollbar-thumb]:hover:bg-stone-600";

export function LiveLog({
  lines,
  running,
}: {
  lines: LogLine[];
  running: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines.length]);

  return (
    <div
      ref={ref}
      aria-live="polite"
      className={`h-72 max-h-72 space-y-1 overflow-y-auto rounded-lg border border-stone-800 bg-stone-950 p-3 font-mono text-xs leading-relaxed text-stone-200 ${SCROLLBAR}`}
    >
      {lines.length === 0 ? (
        <p className="text-stone-500">Waiting for pipeline output…</p>
      ) : (
        lines.map((line) => (
          <div key={line.id} className="break-words whitespace-pre-wrap">
            <span className="mr-1.5 text-amber-500/80 select-none">$</span>
            {line.text}
          </div>
        ))
      )}
      {running && (
        <span className="inline-block h-3.5 w-2 animate-pulse bg-amber-500 align-middle" />
      )}
    </div>
  );
}
