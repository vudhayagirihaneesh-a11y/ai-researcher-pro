"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Gauge, Rocket, Zap } from "lucide-react";
import type { SpeedMode } from "@/lib/types";
import { SPEED_PRESETS } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const SPEED_ICON: Record<SpeedMode, typeof Zap> = {
  fast: Zap,
  medium: Gauge,
  max: Rocket,
};

export function ModeSelector({
  value,
  onChange,
  disabled,
}: {
  value: SpeedMode;
  onChange: (mode: SpeedMode) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const preset = SPEED_PRESETS[value];
  const Icon = SPEED_ICON[value];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-full bg-gray-100 px-3.5 text-[13px] font-medium text-gray-700 transition-colors",
          "hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
          "disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
        )}
        aria-label={`Research depth: ${preset.label}. Change mode.`}
      >
        <Icon className="size-3.5 text-blue-600 dark:text-blue-400" />
        {preset.label}
        {open ? (
          <ChevronUp className="size-3.5 text-gray-500" />
        ) : (
          <ChevronDown className="size-3.5 text-gray-500" />
        )}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        sideOffset={10}
        className="w-72 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg dark:border-stone-700 dark:bg-stone-900"
      >
        <p className="px-3 pt-2 pb-1.5 text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
          Research depth
        </p>
        {(["fast", "medium", "max"] as SpeedMode[]).map((mode) => {
          const p = SPEED_PRESETS[mode];
          const MIcon = SPEED_ICON[mode];
          const selected = mode === value;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => {
                onChange(mode);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                selected
                  ? "bg-gray-100 dark:bg-stone-800"
                  : "hover:bg-gray-50 dark:hover:bg-stone-800/60"
              )}
            >
              <MIcon
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  selected
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-400"
                )}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-gray-900 dark:text-stone-100">
                  {p.label}
                </span>
                <span className="block text-xs leading-snug text-gray-500 dark:text-stone-400">
                  {p.tagline}
                </span>
              </span>
              {selected && (
                <Check className="mt-0.5 size-4 shrink-0 text-gray-900 dark:text-stone-100" />
              )}
            </button>
          );
        })}
        <p className="px-3 pt-1.5 pb-1 text-[11px] leading-snug text-gray-400">
          Caps apply per run — word targets scale with the topic and plan.
        </p>
      </PopoverContent>
    </Popover>
  );
}
