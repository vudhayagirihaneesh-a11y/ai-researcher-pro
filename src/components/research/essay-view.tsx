"use client";

import { memo } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toDownloadUrl } from "@/components/research/utils";
import { toast } from "sonner";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="font-[family-name:var(--font-lora)] mt-10 mb-5 text-3xl leading-tight font-semibold tracking-tight text-stone-900 first:mt-0 dark:text-stone-50 sm:text-[2.25rem]">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-[family-name:var(--font-lora)] mt-10 mb-3 border-b border-stone-200 pb-2 text-2xl font-semibold tracking-tight text-stone-900 dark:border-stone-800 dark:text-stone-50">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-[family-name:var(--font-lora)] mt-8 mb-2 text-xl font-semibold text-stone-900 dark:text-stone-100">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-6 mb-2 text-base font-semibold text-stone-900 dark:text-stone-100">
      {children}
    </h4>
  ),
  p: ({ children, node }) => {
    // Unwrap paragraphs that contain only an image so <figure> is never
    // nested inside <p> (invalid HTML → React hydration warning)
    const el = node as any;
    const kids = el?.children ?? [];
    const meaningful = kids.filter(
      (k: any) => !(k.type === "text" && !k.value.trim())
    );
    if (meaningful.length === 1 && meaningful[0]?.tagName === "img") {
      return <>{children}</>;
    }
    return (
      <p className="text-[15.5px] leading-[1.8] text-stone-700 dark:text-stone-300">
        {children}
      </p>
    );
  },
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-blue-700 underline decoration-blue-300/60 underline-offset-4 transition-colors hover:decoration-blue-600 dark:text-blue-400"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="my-4 list-disc space-y-1.5 pl-6 text-[15px] leading-relaxed text-stone-700 marker:text-blue-600 dark:text-stone-300 dark:marker:text-blue-400">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 list-decimal space-y-1.5 pl-6 text-[15px] leading-relaxed text-stone-700 marker:text-blue-600 dark:text-stone-300 dark:marker:text-blue-400">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-5 rounded-r-lg border-l-4 border-blue-500/70 bg-blue-50/60 px-4 py-2 italic text-stone-700 dark:bg-blue-950/20 dark:text-stone-300">
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr className="my-8 border-0 border-t border-stone-200 dark:border-stone-800" />
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-stone-900 dark:text-stone-100">
      {children}
    </strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children, className }) => {
    const isBlock = /language-/.test(className ?? "");
    if (isBlock) {
      return (
        <code className="block overflow-x-auto rounded-xl bg-stone-950 p-4 font-mono text-xs leading-relaxed text-stone-200">
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[0.85em] text-blue-800 dark:bg-stone-800 dark:text-blue-300">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="my-4">{children}</pre>,
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-stone-200 dark:border-stone-800">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-stone-200 bg-stone-50 px-3 py-2 text-left font-semibold text-stone-800 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-stone-100 px-3 py-2 align-top text-stone-600 dark:border-stone-800/60 dark:text-stone-300">
      {children}
    </td>
  ),
  img: ({ src, alt }) => {
    const s = typeof src === "string" ? src : "";
    const caption = alt ?? "";
    return (
      <figure className="relative my-8">
        <img
          src={s}
          alt={caption}
          loading="lazy"
          className="w-full rounded-xl border border-stone-200 shadow-sm dark:border-stone-800"
        />
        {s.startsWith("/api/media/") && (
          <a
            href={toDownloadUrl(s)}
            download
            onClick={() => toast.success("Image download started")}
            className="absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-lg bg-stone-950/70 text-white backdrop-blur transition-colors hover:bg-stone-950"
            aria-label="Download image"
          >
            <Download className="size-4" />
          </a>
        )}
        {caption ? (
          <figcaption className="mt-2.5 text-center text-[13px] leading-snug text-stone-500 dark:text-stone-400">
            {caption}
          </figcaption>
        ) : null}
      </figure>
    );
  },
};

export const EssayView = memo(function EssayView({
  markdown,
  running,
}: {
  markdown: string;
  running: boolean;
}) {
  if (!markdown.trim()) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-stone-500 italic dark:text-stone-400">
          {running
            ? "The essay will appear here as it's written, section by section…"
            : "No essay content yet."}
        </p>
        {running && (
          <div className="space-y-3">
            <Skeleton className="h-7 w-2/3 bg-stone-200/70 dark:bg-stone-800/70" />
            <Skeleton className="h-4 w-full bg-stone-200/70 dark:bg-stone-800/70" />
            <Skeleton className="h-4 w-11/12 bg-stone-200/70 dark:bg-stone-800/70" />
            <Skeleton className="h-4 w-4/5 bg-stone-200/70 dark:bg-stone-800/70" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
      </div>
      {running && (
        <span className="mt-1 inline-block h-5 w-2.5 animate-pulse rounded-[2px] bg-blue-600 align-middle" />
      )}
    </div>
  );
});
