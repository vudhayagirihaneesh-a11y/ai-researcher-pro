"use client";

import { useEffect, useRef } from "react";
import { Send, Square } from "lucide-react";
import type { SpeedMode } from "@/lib/types";
import { SPEED_PRESETS } from "@/lib/types";
import { ModeSelector } from "@/components/research/mode-selector";
import { cn } from "@/lib/utils";

export function Composer({
  value,
  onChange,
  onSend,
  onStop,
  running,
  speed,
  onSpeedChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onStop: () => void;
  running: boolean;
  speed: SpeedMode;
  onSpeedChange: (s: SpeedMode) => void;
  disabled?: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea up to a cap.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 208)}px`;
  }, [value]);

  const canSend = value.trim().length > 0 && !running && !disabled;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSend();
    }
  };

  const preset = SPEED_PRESETS[speed];

  return (
    <div className="border-t border-gray-200/80 bg-white/80 backdrop-blur-md pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 dark:border-stone-800 dark:bg-stone-950/80">
      <div className="mx-auto w-full max-w-3xl px-4">
        <div className="rounded-2xl border border-gray-300 bg-white shadow-sm transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-600/15 dark:border-stone-700 dark:bg-stone-900 dark:focus-within:border-blue-500">
          <label htmlFor="chat-input" className="sr-only">
            Ask anything
          </label>
          <textarea
            id="chat-input"
            ref={textareaRef}
            rows={1}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything…"
            className="max-h-52 w-full resize-none bg-transparent px-4 pt-3.5 pb-1 text-[16px] leading-relaxed text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-60 dark:text-stone-100 dark:placeholder:text-stone-500"
          />
          <div className="flex items-center justify-between gap-2 px-2.5 pb-2.5 pt-1">
            <div className="flex min-w-0 items-center gap-2">
              <ModeSelector value={speed} onChange={onSpeedChange} />
              <span className="hidden truncate text-xs text-gray-400 sm:block dark:text-stone-500">
                {preset.tagline}
              </span>
            </div>
            {running ? (
              <button
                type="button"
                onClick={onStop}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white transition-colors hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
                aria-label="Stop generating"
              >
                <Square className="size-4 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onSend}
                disabled={!canSend}
                className={cn(
                  "inline-flex size-10 shrink-0 items-center justify-center rounded-xl transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
                  canSend
                    ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:scale-95"
                    : "cursor-not-allowed bg-blue-600/40 text-white/80"
                )}
                aria-label="Send message"
              >
                <Send className="size-4" />
              </button>
            )}
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] leading-relaxed text-gray-400 dark:text-stone-500">
          Enter to send · Shift+Enter for a new line
        </p>
      </div>
    </div>
  );
}
