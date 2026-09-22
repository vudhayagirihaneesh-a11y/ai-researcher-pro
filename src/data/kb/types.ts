// ─────────────────────────────────────────────────────────────────────────────
// Shared shape for RAG knowledge-base corpus entries.
// Used by the seed corpus files (part-a.ts / part-b.ts / part-c.ts) and by
// the seed script that ingests them into the KnowledgeChunk table.
// ─────────────────────────────────────────────────────────────────────────────

export interface KBEntry {
  /** Unique, stable, kebab-case identifier, e.g. "constitution-article-19". */
  docId: string;
  /** Kebab-case domain id, e.g. "indian-constitution". */
  domain: string;
  /** Concise descriptive title, e.g. "Article 19 — Freedom of speech, assembly and movement". */
  title: string;
  /** 60–140 words of factual, self-contained, evergreen content. */
  content: string;
  /** 6–12 search keywords including synonyms and alternate spellings. */
  keywords: string[];
  /** Provenance label, e.g. "Constitution of India, Part III, Article 19". */
  source: string;
}
