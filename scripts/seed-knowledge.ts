/**
 * Seed the RAG knowledge base.
 *
 *  1. Hand-written curated entries: KB_PART_A (India/law) + KB_PART_B
 *     (science/tech/economics) + KB_PART_C (world/society/methods).
 *  2. Passages parsed from the original app's 31 corpus seed markdown files
 *     (upload/ai-researcher_extracted/researcher/corpus/seeds/*.md).
 *
 * Idempotent: upserts by docId, so re-running updates content in place.
 * Ends with retrieval sanity checks through the real BM25 engine.
 *
 * Run: bun scripts/seed-knowledge.ts
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { db } from "../src/lib/db";
import { KB_PART_A } from "../src/data/kb/part-a";
import { KB_PART_B } from "../src/data/kb/part-b";
import { KB_PART_C } from "../src/data/kb/part-c";
import type { KBEntry } from "../src/data/kb/types";
import { searchKnowledge, tokenize } from "../src/lib/research/rag-engine";

const SEEDS_DIR = join(
  process.cwd(),
  "upload/ai-researcher_extracted/researcher/corpus/seeds",
);

function slug(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .split(/\s+/)
      .slice(0, 8)
      .join("-")
      .slice(0, 60) || "section"
  );
}

/** Cut at a sentence boundary near maxChars. */
function capAtSentence(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  const slice = text.slice(0, maxChars);
  const last = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("."));
  return last > maxChars * 0.5
    ? slice.slice(0, last + 1)
    : slice.trimEnd() + "…";
}

function keywordsFor(text: string, n = 8): string[] {
  const freq = new Map<string, number>();
  for (const t of tokenize(text)) {
    if (t.length >= 4) freq.set(t, (freq.get(t) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([t]) => t);
}

/** Parse the original corpus markdown seeds into KB entries. */
async function parseSeeds(): Promise<KBEntry[]> {
  const entries: KBEntry[] = [];
  let files: string[] = [];
  try {
    files = (await readdir(SEEDS_DIR)).filter((f) => f.endsWith(".md")).sort();
  } catch {
    console.warn("Corpus seeds directory not found — skipping md ingestion.");
    return entries;
  }

  for (const file of files) {
    const domain = file.replace(/\.md$/, "").replace(/_/g, "-");
    const raw = await readFile(join(SEEDS_DIR, file), "utf-8");
    const h1Match = raw.match(/^#\s+(.+)$/m);
    const h1 = h1Match?.[1]?.trim() ?? domain.replace(/-/g, " ");

    const sections = raw.split(/\n(?=##\s)/);
    for (const section of sections) {
      const m = section.match(/^##\s+(.+)\s*$/m);
      if (!m) continue;
      const heading = m[1].trim();
      const body = section.replace(/^##\s+.+\n?/, "").trim();
      if (body.length < 200) continue;
      entries.push({
        docId: `seed-${domain}-${slug(heading)}`,
        domain,
        title: `${h1}: ${heading}`.slice(0, 100),
        content: capAtSentence(body, 1100),
        keywords: keywordsFor(`${heading} ${body}`),
        source: `Reference corpus — ${h1}`,
      });
    }
  }
  return entries;
}

async function main() {
  const manual = [...KB_PART_A, ...KB_PART_B, ...KB_PART_C];
  const parsed = await parseSeeds();

  // Manual entries win on docId collisions.
  const byId = new Map<string, KBEntry>();
  for (const e of [...parsed, ...manual]) byId.set(e.docId, e);
  const all = [...byId.values()];

  console.log(
    `Seeding ${all.length} entries ` +
      `(${manual.length} hand-curated + ${parsed.length} parsed from corpus files, ` +
      `${all.length - manual.length} md-only after dedupe)...`,
  );

  let n = 0;
  for (const e of all) {
    await db.knowledgeChunk.upsert({
      where: { docId: e.docId },
      create: {
        docId: e.docId,
        domain: e.domain,
        title: e.title,
        content: e.content,
        keywords: e.keywords.join(", "),
        source: e.source,
        origin: "seed",
      },
      update: {
        domain: e.domain,
        title: e.title,
        content: e.content,
        keywords: e.keywords.join(", "),
        source: e.source,
      },
    });
    n++;
    if (n % 100 === 0) console.log(`  … ${n}/${all.length}`);
  }

  const total = await db.knowledgeChunk.count();
  const byDomain = await db.knowledgeChunk.groupBy({
    by: ["domain"],
    _count: { domain: true },
    orderBy: { _count: { domain: "desc" } },
  });
  console.log(
    `\nDone. Knowledge base holds ${total} passages across ${byDomain.length} domains.`,
  );
  console.log(
    "Top domains:",
    byDomain
      .slice(0, 12)
      .map((d) => `${d.domain}=${d._count.domain}`)
      .join(", "),
  );

  console.log("\n─── Retrieval sanity checks (BM25 through the real engine) ───");
  const tests = [
    "student protest in delhi constitutional rights",
    "article 19 freedom of assembly reasonable restrictions",
    "right to education article 21A RTE act",
    "how does inflation affect the economy",
    "documentary photography photo essay ethics",
    "shaheen bagh right to protest public order",
  ];
  for (const q of tests) {
    const hits = await searchKnowledge(q, { topK: 3 });
    console.log(`\nQuery: "${q}"`);
    hits.forEach((h, i) =>
      console.log(
        `  ${i + 1}. [${h.domain}] ${h.title} (score ${h.score.toFixed(1)})`,
      ),
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
