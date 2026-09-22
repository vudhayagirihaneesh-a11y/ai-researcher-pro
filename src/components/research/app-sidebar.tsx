"use client";

import { useState } from "react";
import {
  BookOpenText,
  Camera,
  FolderArchive,
  MessageSquare,
  Plus,
  Telescope,
  Trash2,
} from "lucide-react";
import type { SessionListItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatDateShort,
  sessionModeLabel,
} from "@/components/research/utils";

export function SidebarContent({
  sessions,
  activeId,
  loadingId,
  onNewChat,
  onSelect,
  onDelete,
}: {
  sessions: SessionListItem[];
  activeId: string | null;
  loadingId: string | null;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <div className="flex h-full min-h-0 flex-col bg-gray-50 dark:bg-stone-900">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 pt-5 pb-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
          <BookOpenText className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[15px] leading-tight font-bold tracking-tight text-gray-900 dark:text-stone-100">
            AI Researcher
          </p>
          <p className="truncate text-[11px] leading-tight text-gray-500 dark:text-stone-400">
            Deep research · photos
          </p>
        </div>
      </div>

      {/* New chat */}
      <div className="px-3">
        <Button
          onClick={onNewChat}
          className="h-10 w-full gap-2 rounded-lg bg-blue-600 text-[14px] font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
        >
          <Plus className="size-4" />
          New chat
        </Button>
      </div>

      {/* History */}
      <nav
        aria-label="Chat history"
        className="mt-5 flex min-h-0 flex-1 flex-col"
      >
        <p className="px-4 pb-1.5 text-[11px] font-semibold tracking-wider text-gray-400 uppercase dark:text-stone-500">
          History
        </p>
        <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 pb-4 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-stone-700">
          {sessions.length === 0 ? (
            <p className="px-2 py-6 text-center text-xs leading-relaxed text-gray-400 dark:text-stone-500">
              No conversations yet.
              <br />
              Your research runs and chats will appear here.
            </p>
          ) : (
            sessions.map((s) => {
              const active = s.id === activeId;
              const isChat = s.kind === "chat";
              const isPhoto = s.mode === "photo-essay";
              return (
                <div
                  key={s.id}
                  className="group/item relative"
                >
                  <button
                    type="button"
                    onClick={() => onSelect(s.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg py-2.5 pr-2 pl-2.5 text-left transition-colors",
                      active
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                        : "text-gray-700 hover:bg-gray-100 dark:text-stone-300 dark:hover:bg-stone-800"
                    )}
                  >
                    {isChat ? (
                      <MessageSquare
                        className={cn(
                          "size-4 shrink-0",
                          active
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-400 dark:text-stone-500"
                        )}
                      />
                    ) : isPhoto ? (
                      <Camera
                        className={cn(
                          "size-4 shrink-0",
                          active
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-400 dark:text-stone-500"
                        )}
                      />
                    ) : (
                      <Telescope
                        className={cn(
                          "size-4 shrink-0",
                          active
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-400 dark:text-stone-500"
                        )}
                      />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] leading-tight font-medium">
                        {s.title ?? s.topic}
                      </span>
                      <span
                        className={cn(
                          "block truncate text-[11px] leading-tight",
                          active
                            ? "text-blue-600/70 dark:text-blue-300/70"
                            : "text-gray-400 dark:text-stone-500"
                        )}
                      >
                        {sessionModeLabel(s.mode, s.kind)}
                        {s.kind === "research" && s.wordCount > 0
                          ? ` · ${s.wordCount.toLocaleString()} words`
                          : ""}{" "}
                        · {formatDateShort(s.createdAt)}
                      </span>
                    </span>
                  </button>
                  {confirmId === s.id ? (
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmId(null);
                        onDelete(s.id);
                      }}
                      onMouseLeave={() => setConfirmId(null)}
                      className="absolute top-1/2 right-1.5 inline-flex h-7 -translate-y-1/2 items-center gap-1 rounded-md bg-red-600 px-2 text-[11px] font-medium text-white shadow-sm"
                      aria-label={`Confirm delete ${s.title ?? s.topic}`}
                    >
                      <Trash2 className="size-3" />
                      Delete
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmId(s.id)}
                      className="absolute top-1/2 right-1.5 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 opacity-0 transition-all group-hover/item:opacity-100 hover:bg-gray-200 hover:text-red-600 focus-visible:opacity-100 dark:hover:bg-stone-700"
                      aria-label={`Delete ${s.title ?? s.topic}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </nav>

      {/* Footer note */}
      <div className="space-y-2 border-t border-gray-200 px-4 py-3 dark:border-stone-800">
        <p className="text-[11px] leading-relaxed text-gray-400 dark:text-stone-500">
          Runs survive disconnects — cancelled research keeps writing in the
          background.
        </p>
      </div>
    </div>
  );
}
