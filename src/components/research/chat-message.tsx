"use client";

import { memo } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";
import {
  formatClockTime,
  type ChatMsg,
} from "@/components/research/utils";
import { ResearchBlock } from "@/components/research/research-block";
import { cn } from "@/lib/utils";

const chatComponents: Components = {
  h1: ({ children }) => (
    <h3 className="mt-3 mb-2 text-base font-semibold first:mt-0">{children}</h3>
  ),
  h2: ({ children }) => (
    <h3 className="mt-3 mb-2 text-base font-semibold first:mt-0">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="mt-2.5 mb-1.5 text-[15px] font-semibold first:mt-0">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="my-1.5 leading-relaxed first:mt-0 last:mb-0">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900 dark:text-stone-100">
      {children}
    </strong>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-800 dark:text-blue-400"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.85em] text-blue-800 dark:bg-stone-800 dark:text-blue-300">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-2 overflow-x-auto rounded-lg bg-gray-950 p-3 text-xs text-gray-100">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-3 border-blue-300 pl-3 text-gray-600 italic dark:border-blue-700 dark:text-stone-300">
      {children}
    </blockquote>
  ),
};

export const ChatMessageView = memo(function ChatMessageView({
  msg,
  liveElapsedMs,
  onCancelResearch,
}: {
  msg: ChatMsg;
  liveElapsedMs: number;
  onCancelResearch: () => void;
}) {
  const time = formatClockTime(msg.createdAt);

  // ── User bubble ─────────────────────────────────────────────────────────
  if (msg.role === "user") {
    return (
      <div className="flex items-end justify-end gap-2.5">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-blue-600 px-4 py-2.5 text-white shadow-sm sm:max-w-[75%]">
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {msg.content}
          </p>
          <p className="mt-0.5 text-right text-[11px] leading-none text-blue-200">
            {time}
          </p>
        </div>
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600 dark:bg-stone-700 dark:text-stone-300"
          aria-hidden="true"
        >
          <User className="size-4" />
        </span>
      </div>
    );
  }

  // ── Assistant message ───────────────────────────────────────────────────
  const isResearch = msg.kind === "research" && msg.research;
  const showDots = msg.kind !== "research" && msg.content.length === 0;

  return (
    <div className="flex items-start gap-2.5">
      <span
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm",
          msg.kind !== "chat" && "rounded-lg"
        )}
        aria-hidden="true"
      >
        <Bot className="size-4.5" />
      </span>
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="flex items-baseline gap-2 text-[13px] leading-none font-semibold text-gray-900 dark:text-stone-100">
          AI Researcher
          <span className="text-[11px] font-normal text-gray-400 dark:text-stone-500">
            {time}
          </span>
        </p>

        {isResearch ? (
          <ResearchBlock
            run={msg.research!}
            liveElapsedMs={liveElapsedMs}
            onCancel={onCancelResearch}
          />
        ) : showDots ? (
          <div className="inline-flex items-center gap-1.5 py-2" aria-label="Assistant is typing">
            <span className="size-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
            <span className="size-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
            <span className="size-2 animate-bounce rounded-full bg-gray-400" />
          </div>
        ) : (
          <div className="max-w-none rounded-2xl rounded-tl-md bg-gray-100 px-4 py-3 text-[15px] leading-relaxed text-gray-800 dark:bg-stone-800 dark:text-stone-200">
            <ReactMarkdown components={chatComponents}>
              {msg.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
});
