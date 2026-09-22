"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BookMarked,
  Database,
  Loader2,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface KBStats {
  total: number;
  learned: number;
  seeded: number;
  domains: { domain: string; count: number }[];
  recentLearned: {
    docId: string;
    title: string;
    domain: string;
    source: string;
    createdAt: string;
  }[];
}

interface KBSearchHit {
  docId: string;
  title: string;
  domain: string;
  source: string;
  origin: string;
  content: string;
  score: number;
}

export function KnowledgeExplorer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [stats, setStats] = useState<KBStats | null>(null);
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<string | null>(null);
  const [hits, setHits] = useState<KBSearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open || stats) return;
    fetch("/api/knowledge/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setStats(data as KBStats))
      .catch(() => {
        /* non-critical */
      });
  }, [open, stats]);

  const runSearch = useCallback(
    async (q: string, d: string | null) => {
      setSearching(true);
      try {
        const params = new URLSearchParams({ q, limit: "20" });
        if (d) params.set("domain", d);
        const res = await fetch(`/api/knowledge/search?${params.toString()}`);
        const data = res.ok ? await res.json() : { hits: [] };
        setHits((data.hits ?? []) as KBSearchHit[]);
      } catch {
        setHits([]);
      } finally {
        setSearched(true);
        setSearching(false);
      }
    },
    [],
  );

  // Debounced live search
  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setHits([]);
      setSearched(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      void runSearch(query.trim(), domain);
    }, 320);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, domain, open, runSearch]);

  const selectDomain = (d: string) => {
    const next = domain === d ? null : d;
    setDomain(next);
    if (query.trim()) void runSearch(query.trim(), next);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] gap-0 overflow-hidden border-stone-200 bg-stone-50 p-0 sm:max-w-2xl dark:border-stone-800 dark:bg-stone-950">
        <DialogHeader className="border-b border-stone-200 px-5 py-4 dark:border-stone-800">
          <DialogTitle className="flex items-center gap-2 text-base">
            <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Database className="size-4" />
            </span>
            RAG Knowledge Base
            {stats && (
              <Badge
                variant="outline"
                className="ml-1 border-emerald-200 bg-emerald-50 font-normal text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
              >
                {stats.total.toLocaleString()} passages ·{" "}
                {stats.domains.length} domains
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs">
            A curated corpus of verified facts — Indian Constitution articles,
            landmark judgments, history, science, economics and more — retrieved
            by a BM25 engine to ground every research essay. It also grows:
            passages distilled from web research are auto-learned into the
            corpus.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 px-5 py-4">
          {/* Search row */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Try "article 19", "protest rights", "inflation"…'
              className="h-11 border-stone-300 bg-white pl-9 text-base dark:border-stone-700 dark:bg-stone-900"
              aria-label="Search the knowledge base"
            />
            {searching && (
              <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-amber-600" />
            )}
            {!!query && !searching && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Domain chips */}
          {stats && (
            <div className="flex max-h-20 flex-wrap gap-1.5 overflow-y-auto pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-stone-300 dark:[&::-webkit-scrollbar-thumb]:bg-stone-700">
              {stats.domains.map((d) => (
                <button
                  key={d.domain}
                  type="button"
                  onClick={() => selectDomain(d.domain)}
                  className={cn(
                    "min-h-8 rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors",
                    domain === d.domain
                      ? "border-emerald-400 bg-emerald-100 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "border-stone-200 bg-white text-stone-500 hover:border-emerald-300 hover:text-emerald-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-emerald-800 dark:hover:text-emerald-400",
                  )}
                >
                  {d.domain}
                  <span className="ml-1 opacity-60">{d.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results / overview */}
        <div className="min-h-0 flex-1 border-t border-stone-200 dark:border-stone-800">
          {query.trim() ? (
            <ScrollArea className="h-[46vh]">
              <div className="space-y-2.5 p-5 pt-4">
                {searched && hits.length === 0 && !searching && (
                  <p className="py-8 text-center text-sm text-stone-500 dark:text-stone-400">
                    No passages matched “{query}”
                    {domain ? ` in ${domain}` : ""}.
                  </p>
                )}
                {hits.map((hit) => (
                  <div
                    key={hit.docId}
                    className="rounded-xl border border-stone-200 bg-white/80 p-3.5 dark:border-stone-800 dark:bg-stone-900/60"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm leading-snug font-semibold text-stone-800 dark:text-stone-100">
                        {hit.title}
                      </p>
                      <Badge
                        variant="outline"
                        className="shrink-0 border-stone-300 font-mono text-[10px] font-normal text-stone-400 dark:border-stone-700"
                      >
                        score {hit.score.toFixed(1)}
                      </Badge>
                    </div>
                    <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
                      {hit.content}
                    </p>
                    <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] tracking-wide text-stone-400 uppercase">
                      <span className="rounded bg-stone-100 px-1.5 py-0.5 font-mono dark:bg-stone-800">
                        {hit.domain}
                      </span>
                      {hit.origin === "web" ? (
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-500">
                          <Sparkles className="size-3" />
                          auto-learned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <BookMarked className="size-3" />
                          curated
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="h-[46vh] overflow-y-auto p-5 pt-4 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-stone-300 dark:[&::-webkit-scrollbar-thumb]:bg-stone-700">
              {!stats ? (
                <div className="flex items-center justify-center gap-2 py-12 text-sm text-stone-400">
                  <Loader2 className="size-4 animate-spin" />
                  Loading corpus statistics…
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { label: "Total passages", value: stats.total },
                      { label: "Curated (seed)", value: stats.seeded },
                      { label: "Auto-learned", value: stats.learned },
                    ].map((cell) => (
                      <div
                        key={cell.label}
                        className="rounded-xl border border-stone-200 bg-white/80 p-3 text-center dark:border-stone-800 dark:bg-stone-900/60"
                      >
                        <p className="font-mono text-xl font-semibold text-emerald-700 dark:text-emerald-400">
                          {cell.value.toLocaleString()}
                        </p>
                        <p className="mt-0.5 text-[10px] tracking-wide text-stone-400 uppercase">
                          {cell.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  {stats.recentLearned.length > 0 && (
                    <div>
                      <p className="text-xs font-medium tracking-wide text-stone-500 uppercase dark:text-stone-400">
                        Recently auto-learned from research
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {stats.recentLearned.map((item) => (
                          <li
                            key={item.docId}
                            className="flex items-start gap-2 rounded-lg border border-amber-200/70 bg-amber-50/50 px-3 py-2 text-xs dark:border-amber-900/50 dark:bg-amber-950/20"
                          >
                            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-amber-600 dark:text-amber-500" />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-medium text-stone-700 dark:text-stone-200">
                                {item.title}
                              </span>
                              <span className="block truncate font-mono text-[10px] text-stone-400">
                                {item.domain}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium tracking-wide text-stone-500 uppercase dark:text-stone-400">
                      Corpus coverage by domain
                    </p>
                    <div className="mt-2 space-y-1">
                      {stats.domains.slice(0, 12).map((d) => (
                        <div
                          key={d.domain}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span className="w-40 shrink-0 truncate font-mono text-stone-500 dark:text-stone-400">
                            {d.domain}
                          </span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
                            <div
                              className="h-full rounded-full bg-emerald-500/80"
                              style={{
                                width: `${Math.max(4, (d.count / (stats.domains[0]?.count || 1)) * 100)}%`,
                              }}
                            />
                          </div>
                          <span className="w-8 shrink-0 text-right font-mono text-stone-400">
                            {d.count}
                          </span>
                        </div>
                      ))}
                      {stats.domains.length > 12 && (
                        <p className="pt-1 text-[11px] text-stone-400">
                          + {stats.domains.length - 12} more domains — search or
                          pick a chip above to explore.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-stone-200 px-5 py-3 dark:border-stone-800">
          <p className="text-[11px] text-stone-400">
            Hybrid retrieval: BM25 + field weighting + phrase boost + domain
            diversity
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 text-stone-500"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
