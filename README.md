# AI Researcher Pro

A RAG-grounded deep-research chat app: ask anything — quick questions get
instant knowledge-base-grounded answers, and research requests run a full
deep-research pipeline (plan → knowledge retrieval → web search → page
reading → images → section-by-section writing with length enforcement →
finalized essay with references).

Built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 ·
shadcn/ui · Prisma (SQLite) · z-ai-web-dev-sdk**.

## Features

- **Chat interface** — sidebar with history, "+ New chat", connected status,
  light/dark theme, chat bubbles with timestamps.
- **Three research modes** — *Fast* (up to 20k words · 10 photos),
  *Medium* (up to 50k words · 20 photos), *Max* (up to 100k words · 30
  photos). Caps are enforced in the pipeline.
- **Intent routing** — the server classifies each new message: quick chat
  (KB-grounded reply) vs deep research (full pipeline with essay, photos,
  sources).
- **Curated RAG knowledge base** — 450+ hand-written reference passages
  across 48 domains (Indian constitution, history, science, economics,
  world affairs …) retrieved via a BM25 engine with synonym expansion and
  domain diversity.
- **Auto-learning corpus** — researched web pages are distilled into new
  knowledge passages on every run.
- **Real research** — multi-query web search, page reading, inline [S#]
  citations plus [K#] knowledge-base citations.
- **Downloadable imagery** — AI-generated documentary photos (photo-essay
  mode) or real web photos mirrored locally (essay mode); per-image
  downloads, ZIP of all photos, standalone HTML export with embedded
  images, Markdown export.
- **Detached runs** — closing the tab or pressing Stop doesn't kill the
  research; the pipeline keeps running server-side and the finished essay
  appears in History.

## Setup

```bash
bun install            # or npm install
bun run db:push        # create the SQLite schema (db/custom.db)
bun run seed           # optional: (re)seed the knowledge base — the bundled
                       # db/custom.db already contains 450+ passages
bun run dev            # http://localhost:3000
```

> The backend uses `z-ai-web-dev-sdk` (LLM, web search, page reader, image
> generation) — it must run in a environment where that SDK is available.

## Scripts

| Script | Purpose |
| --- | --- |
| `bun run dev` | Start the Next.js dev server |
| `bun run db:push` | Push the Prisma schema to SQLite |
| `bun run seed` | Seed the knowledge base from `src/data/kb/*` + corpus seeds |
| `bun scripts/smoke-research.ts [essay\|photo-essay]` | Run a research pipeline end-to-end via the API |

## Project layout

```
prisma/schema.prisma        ResearchSession (kind: research|chat) · EssayImage ·
                            ChatMessage · KnowledgeChunk
src/app/page.tsx            Chat UI orchestrator (client)
src/app/api/chat            Unified SSE endpoint: intent classification →
                            quick reply OR deep-research pipeline
src/app/api/research        Direct SSE research endpoint (same pipeline)
src/app/api/sessions        History list/detail/delete
src/app/api/export          Markdown / standalone-HTML essay export
src/app/api/download-zip    ZIP export (essay.md + photos + index.html)
src/app/api/media/[name]    Local media serving (?download=1 for attachment)
src/app/api/knowledge/*     KB stats + BM25 search (explorer)
src/lib/research/pipeline   The 7-stage research pipeline
src/lib/research/rag-engine BM25 retrieval, auto-learning, stats
src/lib/research/llm        z-ai SDK wrapper (retries, JSON extraction)
src/lib/research/search     Web search + page reading + context building
src/lib/research/images     Image generation (content-filter ladder) + web
                            image mirroring
src/lib/types.ts            Shared contract: SPEED_PRESETS (fast/medium/max
                            caps), SSE events, DTOs
src/data/kb/*               291 hand-curated knowledge entries (452 passages
                            after seed parse)
src/components/research/*   Chat UI components (sidebar, composer with mode
                            selector, message bubbles, research block,
                            essay view, photo gallery, sources, KB explorer)
```

## Research modes

| Mode | Word cap | Photo cap | Sections | Search queries | KB passages |
| --- | --- | --- | --- | --- | --- |
| Fast | 20,000 | 10 | 8–12 | 4 | 8 |
| Medium | 50,000 | 20 | 14–20 | 6 | 12 |
| Max | 100,000 | 30 | 24–32 | 8 | 16 |

Photo-essay requests use the full photo cap (one frame per photo section);
plain essays gather fewer illustrative images.
