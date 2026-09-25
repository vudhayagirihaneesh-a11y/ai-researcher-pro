import { db } from "@/lib/db";
import {
  chatComplete,
  extractJson,
  countWords,
} from "./llm";
import {
  webSearch,
  readPage,
  toSourceDTOs,
  buildResearchContext,
  type ReadPage,
} from "./search";
import { findWebImages, findWebImagesMultiQuery } from "./images";
import {
  searchKnowledge,
  learnFromPages,
  kbCount,
  type KBHit,
} from "./rag-engine";
import type {
  ResearchRequest,
  SSEEvent,
  SourceDTO,
  EssayImageDTO,
  OutlineSection,
  SessionStats,
} from "@/lib/types";
import { SPEED_PRESETS } from "@/lib/types";

// ─── Event queue ─────────────────────────────────────────────────────────────

export class EventQueue {
  private queue: SSEEvent[] = [];
  private waiters: ((evt: SSEEvent | null) => void)[] = [];
  private ended = false;

  push(evt: SSEEvent) {
    if (this.ended) return;
    const waiter = this.waiters.shift();
    if (waiter) waiter(evt);
    else this.queue.push(evt);
  }

  next(): Promise<SSEEvent | null> {
    const evt = this.queue.shift();
    if (evt) return Promise.resolve(evt);
    if (this.ended) return Promise.resolve(null);
    return new Promise((resolve) => this.waiters.push(resolve));
  }

  end() {
    this.ended = true;
    while (this.waiters.length) {
      this.waiters.shift()!(null);
    }
  }
}

// ─── Planning ────────────────────────────────────────────────────────────────

interface ImagePlanItem {
  prompt: string;
  caption: string;
}

interface ResearchPlan {
  title: string;
  queries: string[];
  outline: OutlineSection[];
  imagePlan: ImagePlanItem[];
}

function constitutionHint(topic: string, notes?: string): string {
  const t = `${topic} ${notes ?? ""}`.toLowerCase();
  if (
    /constitution|article|protest|rights|freedom|india|student|assembly|speech/.test(
      t
    )
  ) {
    return `CONSTITUTIONAL ENRICHMENT: This piece MUST be enriched with specific Articles of the Constitution of India where relevant — e.g. Article 14 (equality before law), Article 19(1)(a) (freedom of speech and expression), Article 19(1)(b) (right to peaceful assembly without arms), Articles 19(2)–(4) (reasonable restrictions), Article 21 (right to life and personal liberty, dignity, education), Article 21A (right to education), Article 15 (non-discrimination), Article 32 (constitutional remedies — right to move the Supreme Court), Article 226 (High Court writ jurisdiction), Article 51A (fundamental duties), Article 300A (right to property), and the Directive Principles (Art. 45). Weave them naturally into the narrative and analysis, quoting the operative language where impactful.`;
  }
  return "";
}

const WRITER_SYSTEM = `You are an award-winning long-form journalist, essayist and researcher. You write rich, specific, flowing prose — never generic filler, never bullet-point padding. You synthesize provided research material and cite sources inline as [S1], [S2] etc. You ALWAYS meet or exceed the requested word count — you never stop early. You never write meta commentary, never apologize, never mention being an AI. You output ONLY the requested markdown content.`;

async function planResearch(req: ResearchRequest): Promise<ResearchPlan> {
  const preset = SPEED_PRESETS[req.speed];
  const isPhotoEssay = req.mode === "photo-essay";
  
  // See if user explicitly asked for a number of photos
  const fullText = `${req.topic} ${req.notes ?? ""}`.toLowerCase();
  const match = fullText.match(/\b(\d+)\s*photo(?:s|graphs)?\b/);
  const requestedPhotos = match ? parseInt(match[1], 10) : null;
  
  const maxAllowed = isPhotoEssay ? preset.maxImages : preset.essayImages;
  const photoCount = requestedPhotos 
    ? Math.max(1, Math.min(requestedPhotos, maxAllowed)) 
    : maxAllowed;

  // Extract custom word or line count
  let targetWords = preset.targetWords;
  let maxWords = preset.maxWords;
  let sections = preset.sections;
  const lengthMatch = fullText.match(/\b(\d+)\s*(word|line)s?\b/);
  if (lengthMatch) {
    const amount = parseInt(lengthMatch[1], 10);
    const multiplier = lengthMatch[2] === "line" ? 10 : 1;
    targetWords = Math.max(300, Math.min(amount * multiplier, 100000));
    maxWords = Math.max(maxWords, targetWords * 1.5);
    const idealSections = Math.max(2, Math.round(targetWords / 800));
    sections = [Math.max(2, idealSections - 1), idealSections + 2];
  }
  const hint = constitutionHint(req.topic, req.notes);

  const photoInstructions = isPhotoEssay
    ? `"outline" — exactly ${photoCount + 3} sections in order:
       1. One opening context section (~220 words) setting the scene of the event.
       2. Then ${photoCount} photo sections, one per photograph. Each ~150 words. Heading format: "Frame {i} — {evocative four-to-six word title}". The brief for each describes the moment that photograph captures; together they must form a chronological narrative arc (build-up → march → confrontation/turning point → aftermath → resolution).
       3. One closing reflection section (~200 words).
     "image_plan" — exactly ${photoCount} entries matching photo sections 1..N in order. Each "prompt" is a 35–60 word photorealistic documentary photograph description: scene, location, subjects, action, weather/light, mood, composition (e.g. wide shot, close-up, over-the-shoulder). Depict Delhi recognizably where fitting (Jantar Mantar, India Gate, Connaught Place, university gates, Raisina Hill in the distance). Placard text (if any) must be short and legible. No celebrities, no real politicians, no gore, no violence beyond tense standoffs.`
    : `"outline" — between ${sections[0]} and ${sections[1]} logical sections that build a complete, in-depth essay (introduction, themed body sections, analysis, conclusion). Distribute the word budget across sections — each section should target roughly ${Math.round(targetWords / ((sections[0] + sections[1]) / 2))} words.
     "image_plan" — a single search query phrase describing the kind of real photograph that would illustrate this essay well.`;

  const raw = await chatComplete(
    [
      {
        role: "system",
        content:
          "You are the planning module of a deep-research engine. You reply with STRICT JSON only — no prose, no code fences.",
      },
      {
        role: "user",
        content: `Plan a ${isPhotoEssay ? "PHOTO ESSAY" : "RESEARCH ESSAY"}.

TOPIC: ${req.topic}
${req.notes ? `USER ENRICHMENT NOTES: ${req.notes}` : ""}
TARGET LENGTH: about ${targetWords.toLocaleString()} words total (hard ceiling: ${maxWords.toLocaleString()} words).
${hint}

Return JSON with exactly these keys:
{
  "title": "compelling title (no quotes inside)",
  "search_queries": [${preset.queries} diverse, specific web-search queries for researching this topic — include news, analysis, legal/constitutional and background angles],
  "outline": [ { "heading": "...", "target_words": N, "brief": "what this section covers and why it matters" } ],
  "image_plan": [ ... ]
}

Where:
${photoInstructions}

Distribute target_words so they sum to roughly ${targetWords.toLocaleString()}. Reply with JSON ONLY.`,
      },
    ],
    { maxTokens: 3000, temperature: 0.4, minChars: 200 }
  );

  const n = photoCount;
  const generateFallbackOutline = () => {
    const fallbackOutline: OutlineSection[] = [
      {
        heading: "The Gathering Storm",
        targetWords: Math.round(targetWords * 0.12),
        brief: `Opening context: what sparked "${req.topic}", who is involved, stakes.`,
      },
    ];
    if (isPhotoEssay) {
      for (let i = 1; i <= n; i++) {
        fallbackOutline.push({
          heading: `Frame ${i} — Scene ${i}`,
          targetWords: Math.round((targetWords * 0.62) / n),
          brief: `Photograph ${i} of the narrative arc of ${req.topic}.`,
        });
      }
      fallbackOutline.push({
        heading: "The Constitutional Lens",
        targetWords: Math.round(targetWords * 0.15),
        brief:
          "Legal and constitutional analysis of the events through the Articles of the Constitution of India.",
      });
    } else {
      const bodySections = Math.max(
        3,
        Math.min(sections[1] - 2, Math.round(targetWords / 900))
      );
      for (let i = 1; i <= bodySections; i++) {
        fallbackOutline.push({
          heading: `Chapter ${i} — Dimension ${i}`,
          targetWords: Math.round((targetWords * 0.72) / bodySections),
          brief: `Themed body section ${i} of ${req.topic}: background, developments, analysis.`,
        });
      }
    }
    fallbackOutline.push({
      heading: "What Remains",
      targetWords: Math.round(targetWords * 0.11),
      brief: "Closing reflection on meaning and aftermath.",
    });
    return fallbackOutline;
  };

  const parsed = extractJson<ResearchPlan>(raw);
  
  // sanitize + normalize queries
  const queries = (parsed?.queries ?? [])
    .filter((q) => typeof q === "string" && q.trim().length > 3)
    .slice(0, preset.queries + 2);
  const minQueries = Math.min(3, preset.queries);
  const fallbacks = [
    req.topic,
    `${req.topic} — news, reports and analysis`,
    `${req.topic} — background, history and legal context`,
  ];
  for (const fb of fallbacks) {
    if (queries.length >= minQueries) break;
    if (!queries.some((q) => q.toLowerCase() === fb.toLowerCase())) {
      queries.push(fb);
    }
  }

  // sanitize + normalize outline
  let outline: OutlineSection[] = [];
  if (parsed && Array.isArray(parsed.outline)) {
    outline = (parsed.outline as any[])
      .filter((s) => s && (typeof s.heading === "string" || typeof s === "string"))
      .map((s) => {
        const heading = typeof s.heading === "string" ? s.heading : (typeof s === "string" ? s : "Section");
        const brief = typeof s.brief === "string" ? s.brief : `Detailed analysis of ${heading}`;
        const targetWords = Math.max(90, Math.min(2800, Number(s.target_words) || 160));
        return {
          heading: heading.replace(/^#+\s*/, "").slice(0, 120),
          targetWords,
          brief: brief.slice(0, 600),
        };
      });
  }
  
  if (outline.length < 2) {
    outline = generateFallbackOutline();
  }

  const imagePlan = (parsed?.imagePlan ?? [])
    .filter((p) => p && typeof p.prompt === "string" && p.prompt.length > 10)
    .map((p) => ({
      prompt: String(p.prompt).slice(0, 800),
      caption: String(p.caption ?? "").slice(0, 200) || "Untitled frame",
    }));

  if (imagePlan.length === 0) {
      for (let i = 0; i < (isPhotoEssay ? n : 1); i++) {
        imagePlan.push({
            prompt: `Documentary photograph, scene ${i + 1} of ${req.topic}: students marching in Delhi, placards, overcast monsoon light, photojournalism style`,
            caption: `Scene ${i + 1} — ${req.topic}`,
        });
      }
  }

  return { title: String(parsed?.title ?? req.topic).slice(0, 160), queries, outline, imagePlan };
}

// ─── Section writing ─────────────────────────────────────────────────────────

function photoSectionInstruction(
  i: number,
  plan: ImagePlanItem,
  photoCount: number
): string {
  return `PHOTOGRAPH: This section accompanies photograph ${i} of ${photoCount}.
CAPTION: "${plan.caption}"
SCENE: ${plan.prompt}

The FIRST LINE of your output must be exactly: {{PHOTO_${i}}}
Then write "## <heading>" and ONE substantial, vivid paragraph putting this photograph in context: the moment it captures, what led to it, who is present, sensory detail, and its significance in the larger story.`;
}

async function writeSection(args: {
  heading: string;
  targetWords: number;
  brief: string;
  title: string;
  req: ResearchRequest;
  context: string;
  kbContext: string;
  photoIndex?: number;
  photoPlan?: ImagePlanItem;
  priorHeadings: string[];
  isFinal: boolean;
  q: EventQueue;
}): Promise<string> {
  const {
    heading,
    targetWords,
    brief,
    title,
    req,
    context,
    kbContext,
    photoIndex,
    photoPlan,
    priorHeadings,
    isFinal,
    q,
  } = args;

  const hint = constitutionHint(req.topic, req.notes);
  const photoCount = req.mode === "photo-essay" ? SPEED_PRESETS[req.speed].maxImages : SPEED_PRESETS[req.speed].essayImages;
  const photoBlock =
    photoIndex && photoPlan
      ? photoSectionInstruction(photoIndex, photoPlan, photoCount)
      : "";

  const prompt = `Write the section "${heading}" of the ${req.mode === "photo-essay" ? "photo essay" : "research essay"} titled "${title}".

TOPIC: ${req.topic}
${req.notes ? `USER ENRICHMENT NOTES: ${req.notes}` : ""}
${hint}

SECTION BRIEF: ${brief}
${photoBlock}

${kbContext ? `CURATED KNOWLEDGE BASE PASSAGES (verified reference material — prefer these facts; quote article numbers, dates and holdings precisely; cite inline as [K1], [K2] where used):\n${kbContext}` : ""}
${context ? `WEB RESEARCH MATERIAL (cite inline as [S1], [S2] where used):\n${context}` : !kbContext ? "No research material was gathered — write from the brief with specific, concrete, plausible detail; do not invent statistics or named real individuals." : ""}

${priorHeadings.length ? `SECTIONS ALREADY WRITTEN (do not repeat them): ${priorHeadings.join("; ")}` : ""}

REQUIREMENTS:
- Write approximately ${targetWords} words (between ${Math.round(targetWords * 0.9)} and ${Math.round(targetWords * 1.2)} words). This is a strict length requirement — do not write significantly more or less.
- Begin with the markdown heading line "## ${heading}".
- Flowing prose paragraphs only (no bullet lists, no tables).
- ${isFinal ? "This is the closing section — end with resonance, not a summary label." : "Do not conclude the essay in this section."}
${photoBlock ? `- First line exactly {{PHOTO_${photoIndex}}}, then the heading, then the paragraph.` : ""}
Output ONLY this section's markdown.`;

  const first = await chatComplete(
    [
      { role: "system", content: WRITER_SYSTEM },
      { role: "user", content: prompt },
    ],
    { maxTokens: 3400, temperature: 0.65, minChars: 300, onChunk: (text) => {
      // Stream tokens live! Strip any raw placeholder text
      const clean = text.replace(/\{\{PHOTO_\d+\}\}/g, "");
      if (clean) q.push({ type: "content", text: clean });
    } }
  );

  if (countWords(first) >= targetWords * 0.6) return first;

  // ── LENGTH ENFORCEMENT (retry with stronger instruction) ──
  const retry = await chatComplete(
    [
      { role: "system", content: WRITER_SYSTEM },
      { role: "user", content: prompt },
      {
        role: "assistant",
        content: first,
      },
      {
        role: "user",
        content: `Your attempt was only ${countWords(first)} words, which is outside the required range of ${Math.round(targetWords * 0.9)} to ${Math.round(targetWords * 1.2)} words. Rewrite the FULL section to be approximately ${targetWords} words with appropriate depth, detail and analysis. Same rules as before.`,
      },
    ],
    { maxTokens: 3800, temperature: 0.7, minChars: 400, onChunk: (text) => {
      const clean = text.replace(/\{\{PHOTO_\d+\}\}/g, "");
      if (clean) q.push({ type: "content", text: clean });
    } }
  );
  return countWords(retry) > countWords(first) ? retry : first;
}

async function expandSection(
  heading: string,
  markdown: string,
  addWords: number,
  title: string,
  req: ResearchRequest,
  context: string,
  kbContext: string
): Promise<string> {
  const hint = constitutionHint(req.topic, req.notes);
  const extra = await chatComplete(
    [
      { role: "system", content: WRITER_SYSTEM },
      {
        role: "user",
        content: `You are expanding one section of the essay "${title}" (topic: ${req.topic}). ${hint}

CURRENT SECTION "${heading}" (${countWords(markdown)} words):
${markdown.slice(0, 4000)}

${kbContext ? `KNOWLEDGE BASE PASSAGES:\n${kbContext.slice(0, 5000)}` : ""}
${context ? `WEB RESEARCH MATERIAL:\n${context.slice(0, 8000)}` : ""}

Add ${addWords}+ MORE words of new, non-repetitive depth to this section: fresh analysis, constitutional/legal dimension, consequences, contrasts, or human detail not already covered. Output ONLY the additional markdown paragraphs (no heading).`,
      },
    ],
    { maxTokens: 2000, temperature: 0.65, minChars: 250 }
  );
  return extra;
}

// ─── Image prompt enrichment ─────────────────────────────────────────────────

/** Turn terse planner prompts into rich, consistent documentary photo prompts.
 *  One LLM call for the whole set — keeps the visual narrative coherent. */
async function enrichImagePrompts(
  topic: string,
  notes: string | undefined,
  plan: ImagePlanItem[],
  count: number
): Promise<ImagePlanItem[]> {
  const items: ImagePlanItem[] = [];
  for (let i = 0; i < count; i++) {
    items.push(
      plan[i] ?? {
        prompt: `documentary photograph, moment ${i + 1} of ${topic}`,
        caption: `Frame ${i + 1}`,
      }
    );
  }
  const short = items.every(
    (p) => p.prompt.split(/\s+/).length < 18 || p.prompt.length < 90
  );
  if (!short) return items;

  try {
    const raw = await chatComplete(
      [
        {
          role: "system",
          content:
            "You are a photo editor at a major news agency, expert at writing AI image-generation prompts for photorealistic documentary photography. You reply with STRICT JSON only.",
        },
        {
          role: "user",
          content: `ESSAY TOPIC: ${topic}
${notes ? `NOTES: ${notes}` : ""}

Below are ${count} terse captions/prompts for a chronological photo-essay (build-up → march → turning point → standoff → aftermath → resolution). Rewrite each into ONE rich image-generation prompt of 40–70 words describing: scene, Delhi location (Jantar Mantar / India Gate / university gate / Connaught Place / Raisina Hill etc. where fitting), subjects and action, weather and light (monsoon heat, dust, evening lamps, rain), composition (wide shot / close-up / low angle / over-the-shoulder), mood. IMPORTANT: depict only tense-but-peaceful scenes — marches, sit-ins, vigils, human chains, blockades of desks, speeches, solidarity — never physical violence. Never use the words riot, clash, violence, blood, tear gas, arrest, burn, attack, gun or weapon in the prompts. Placard text (max 3 words) may be specified as 'a placard reading "..."'. Photojournalistic realism, natural color, 35mm lens feel. NO real politicians, no gore.

INPUT:
${items.map((p, i) => `${i + 1}. caption="${p.caption}" prompt="${p.prompt}"`).join("\n")}

Reply with JSON: { "images": [ { "caption": "...", "prompt": "..." } ] } — exactly ${count} entries, same order.`,
        },
      ],
      { maxTokens: 3200, temperature: 0.55, minChars: 200 }
    );
    const parsed = extractJson<{ images: ImagePlanItem[] }>(raw);
    if (parsed?.images && Array.isArray(parsed.images)) {
      const out: ImagePlanItem[] = [];
      for (let i = 0; i < count; i++) {
        const e = parsed.images[i];
        if (e && typeof e.prompt === "string" && e.prompt.length > 60) {
          out.push({
            prompt: e.prompt.slice(0, 800),
            caption:
              (typeof e.caption === "string" && e.caption.trim()) ||
              items[i].caption,
          });
        } else {
          out.push(items[i]);
        }
      }
      return out;
    }
  } catch {
    /* fall through to originals */
  }
  return items;
}

/** Ensure every image markdown sits on its own blank-line-separated block so
 *  it renders as <figure> outside <p> (prevents invalid HTML nesting). */
function separateImageLines(md: string): string {
  return md
    .split("\n")
    .map((line) => {
      const m = line.match(/!\[[^\]]*\]\([^)\s]+\)/);
      if (!m || m.index === undefined) return line;
      const before = line.slice(0, m.index).trim();
      const after = line.slice(m.index + m[0].length).trim();
      if (!before && !after) return line;
      return [before, m[0], after].filter(Boolean).join("\n\n");
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

/** Compact context block of retrieved KB passages; K-numbering matches kbSources ids. */
function buildKnowledgeContext(hits: KBHit[], maxTotalChars = 9000): string {
  if (hits.length === 0) return "";
  const per = Math.max(500, Math.floor(maxTotalChars / hits.length));
  const blocks = hits.map(
    (h, i) =>
      `### K${i + 1}: ${h.title}\n[${h.domain}] ${h.source}\n${h.content.slice(0, per)}`
  );
  return blocks.join("\n\n").slice(0, maxTotalChars);
}

// ─── The pipeline ────────────────────────────────────────────────────────────

export async function executePipeline(
  req: ResearchRequest,
  q: EventQueue,
  sessionId: string
): Promise<void> {
  const preset = SPEED_PRESETS[req.speed];
  const startedAt = Date.now();
  const isPhotoEssay = req.mode === "photo-essay";
  const photoCount = isPhotoEssay ? preset.maxImages : preset.essayImages;

  // The session is created and registered with the broker in route.ts now.
  // We just push the session event so the frontend switches to the new chat ID.
  q.push({ type: "session", sessionId, kind: "research" });

  try {
    // ── 1. PLAN ──────────────────────────────────────────────────────────────
    q.push({
      type: "stage",
      stage: "plan",
      message: `Planning the research strategy for “${req.topic}” …`,
    });
    const plan = await planResearch(req);
    q.push({
      type: "plan",
      title: plan.title,
      queries: plan.queries,
      outline: plan.outline,
    });
    q.push({
      type: "stage_detail",
      message: `Plan ready — ${plan.queries.length} queries, ${plan.outline.length} sections.`,
    });

    // ── 1.5 KNOWLEDGE BASE (RAG retrieval) ─────────────────────────────────
    q.push({
      type: "stage",
      stage: "knowledge",
      message: "Retrieving grounding passages from the curated knowledge base …",
    });
    const kbHits: KBHit[] = [];
    const seenDocs = new Set<string>();
    for (const kq of [req.topic, ...plan.queries.slice(0, 3)]) {
      try {
        const hits = await searchKnowledge(kq, { topK: 6 });
        for (const h of hits) {
          if (!seenDocs.has(h.docId)) {
            seenDocs.add(h.docId);
            kbHits.push(h);
          }
        }
        q.push({
          type: "kb_result",
          query: kq,
          count: hits.length,
          best: hits[0]?.title,
        });
      } catch {
        /* the KB is a booster — never fatal */
      }
    }
    kbHits.sort((a, b) => b.score - a.score);
    const kbSelected = kbHits.slice(0, preset.kbPassages);
    const kbSources: SourceDTO[] = kbSelected.map((h, i) => ({
      id: `K${i + 1}`,
      title: h.title,
      url: "",
      snippet: h.content.slice(0, 280),
      kind: "kb",
      domain: h.domain,
    }));
    const kbContext = buildKnowledgeContext(kbSelected);
    if (kbSelected.length > 0) {
      q.push({ type: "sources", sources: kbSources });
      q.push({
        type: "stage_detail",
        message: `Knowledge base: ${kbSelected.length} passages from ${new Set(kbSelected.map((k) => k.domain)).size} domains — best match: ${kbSelected[0].title}.`,
      });
    } else {
      q.push({
        type: "stage_detail",
        message:
          "Knowledge base: no strong matches for this topic — proceeding with web research.",
      });
    }

    // ── 2. SEARCH ───────────────────────────────────────────────────────────
    const pages: ReadPage[] = [];
    let webSources: SourceDTO[] = [];
    if (req.useWeb) {
      q.push({
        type: "stage",
        stage: "search",
        message: `Searching the web (${plan.queries.length} queries) …`,
      });
      const allResults: { url: string; title: string; snippet: string }[] = [];
      const seen = new Set<string>();
      let searchIdx = 0;
      for (const query of plan.queries.slice(0, preset.queries + 2)) {
        if (searchIdx > 0) {
          await new Promise((r) => setTimeout(r, 600)); // gentle rate-limit stagger
        }
        searchIdx++;
        const results = await webSearch(query, preset.searchResultsPerQuery);
        let added = 0;
        for (const r of results) {
          if (!seen.has(r.url)) {
            seen.add(r.url);
            allResults.push({
              url: r.url,
              title: r.name,
              snippet: r.snippet ?? "",
            });
            added++;
          }
        }
        q.push({
          type: "search_result",
          query,
          count: results.length,
        });
        q.push({
          type: "stage_detail",
          message: `Search “${query}” → ${results.length} results.`,
        });
      }
      webSources = toSourceDTOs(allResults).slice(0, 18);
      q.push({ type: "sources", sources: [...kbSources, ...webSources] });

      // ── 3. READ ───────────────────────────────────────────────────────────
      const toRead = webSources.slice(0, preset.pagesToRead);
      if (toRead.length > 0) {
        q.push({
          type: "stage",
          stage: "read",
          message: `Reading and digesting ${toRead.length} sources …`,
        });
        // batches of 3
        for (let i = 0; i < toRead.length; i += 3) {
          const batch = toRead.slice(i, i + 3);
          const reads = await Promise.all(
            batch.map((s) => readPage(s.url))
          );
          for (const page of reads) {
            if (page) {
              pages.push(page);
              q.push({
                type: "source_read",
                title: page.title,
                url: page.url,
                chars: page.text.length,
              });
            }
          }
        }
        q.push({
          type: "stage_detail",
          message: `Ingested ${pages.length} pages (${pages.reduce((a, p) => a + p.text.length, 0).toLocaleString()} characters of research).`,
        });
      }

      // ── 3.5 AUTO-LEARN: distill what was read into the knowledge base ────
      try {
        const learnable = pages
          .filter((p) => p.text.length > 1200)
          .sort((a, b) => b.text.length - a.text.length)
          .slice(0, 3);
        if (learnable.length > 0) {
          const learned = await learnFromPages(req.topic, learnable);
          if (learned > 0) {
            const total = await kbCount();
            q.push({ type: "kb_learned", count: learned, total });
            q.push({
              type: "stage_detail",
              message: `Auto-learned ${learned} passage${learned === 1 ? "" : "s"} from this research — the knowledge base now holds ${total} entries.`,
            });
          }
        }
      } catch {
        /* non-fatal */
      }
    } else {
      q.push({
        type: "stage_detail",
        message:
          "Web research disabled — grounding the essay in the curated knowledge base.",
      });
    }

    const context = buildResearchContext(pages);
    const sources: SourceDTO[] = [...kbSources, ...webSources];

    // ── 4. IMAGES (real web photos only — no AI generation) ──────────────────
    const images: EssayImageDTO[] = [];
    const wantImages = Math.min(photoCount, preset.maxImages);
    let enrichedImagePlan: ImagePlanItem[] = plan.imagePlan;
    if (wantImages > 0) {
      q.push({
        type: "stage",
        stage: "images",
        message: `Finding ${wantImages} real photographs from the web …`,
      });

      if (isPhotoEssay) {
        // Photo essay: use the image plan captions as targeted search queries
        q.push({
          type: "stage_detail",
          message: "Crafting targeted search queries for each photo scene …",
        });
        const imagePlanItems = await enrichImagePrompts(
          req.topic,
          req.notes,
          plan.imagePlan,
          wantImages
        );
        enrichedImagePlan = imagePlanItems;

        // Build per-scene search queries from the enriched captions
        const searchQueries = imagePlanItems.slice(0, wantImages).map((item, i) => ({
          query: `${req.topic} ${item.caption || item.prompt}`.slice(0, 200),
          caption: item.caption || `Frame ${i + 1}`,
        }));

        q.push({
          type: "image_start",
          index: 1,
          total: wantImages,
          prompt: req.topic,
        });

        const found = await findWebImagesMultiQuery(searchQueries);
        for (const img of found) {
          images.push(img);
          q.push({ type: "image_done", image: img });
        }

        // If some scenes didn't find images, try broader search queries
        if (found.length < wantImages) {
          const missing = wantImages - found.length;
          q.push({
            type: "stage_detail",
            message: `Found ${found.length}/${wantImages} scene photos — searching broader terms for ${missing} more …`,
          });
          const broader = await findWebImages(req.topic, missing, found.length);
          for (const img of broader) {
            images.push(img);
            q.push({ type: "image_done", image: img });
          }
        }
      } else {
        // Regular essay: search directly for the topic
        q.push({
          type: "image_start",
          index: 1,
          total: wantImages,
          prompt: req.topic,
        });
        const found = await findWebImages(req.topic, wantImages);
        for (const img of found) {
          images.push(img);
          q.push({ type: "image_done", image: img });
        }
      }

      if (images.length === 0) {
        q.push({
          type: "stage_detail",
          message: "No suitable real photos found for this topic — proceeding without images.",
        });
      } else {
        q.push({
          type: "stage_detail",
          message: `Collected ${images.length} real photographs from the web.`,
        });
      }
    }

    // ── 5. WRITE ────────────────────────────────────────────────────────────
    q.push({
      type: "stage",
      stage: "write",
      message: `Writing the ${isPhotoEssay ? "photo essay" : "essay"} section by section (${plan.outline.length} sections, ~${preset.targetWords.toLocaleString()} words, cap ${preset.maxWords.toLocaleString()}) …`,
    });

    // Map photo sections to image indices — hybrid: explicit "Frame N" headings
    // first, positional fallback (sections after the intro) if planner deviated.
    const photoSectionMap = new Map<number, number>(); // sectionIdx -> photoNumber
    if (isPhotoEssay && images.length > 0) {
      for (let i = 0; i < plan.outline.length; i++) {
        const m = plan.outline[i].heading.match(/^frame\s*(\d+)/i);
        if (m) {
          const n = parseInt(m[1], 10);
          if (n >= 1 && n <= images.length && ![...photoSectionMap.values()].includes(n)) {
            photoSectionMap.set(i, n);
          }
        }
      }
      if (photoSectionMap.size === 0) {
        for (
          let i = 1;
          i < plan.outline.length && i - 1 < images.length;
          i++
        ) {
          photoSectionMap.set(i, i);
        }
      }
    }

    const sections: { heading: string; markdown: string; words: number; target: number }[] = [];
    const priorHeadings: string[] = [];
    let hitWordCap = false;

    for (let i = 0; i < plan.outline.length; i++) {
      // HARD WORD CAP — never write past the mode's ceiling
      const wordsSoFar = sections.reduce((a, s) => a + s.words, 0);
      if (wordsSoFar >= preset.maxWords * 0.98) {
        hitWordCap = true;
        q.push({
          type: "stage_detail",
          message: `Word cap reached (${preset.maxWords.toLocaleString()} words) — skipping the remaining ${plan.outline.length - i} outline sections.`,
        });
        break;
      }
      const sec = plan.outline[i];
      const photoNum = photoSectionMap.get(i);
      const photoIndex: number | undefined = photoNum;
      const photoPlanItem: ImagePlanItem | undefined = photoNum
        ? enrichedImagePlan[photoNum - 1] ??
          plan.imagePlan[photoNum - 1] ??
          undefined
        : undefined;
      q.push({
        type: "section_start",
        heading: sec.heading,
        index: i + 1,
        total: plan.outline.length,
      });
      const md = await writeSection({
        heading: sec.heading,
        targetWords: sec.targetWords,
        brief: sec.brief,
        title: plan.title,
        req,
        context,
        kbContext,
        photoIndex,
        photoPlan: photoPlanItem,
        priorHeadings: [...priorHeadings],
        isFinal: i === plan.outline.length - 1,
        q,
      });
      const words = countWords(md);
      sections.push({ heading: sec.heading, markdown: md, words, target: sec.targetWords });
      priorHeadings.push(sec.heading);
      q.push({ type: "content", text: "\n\n" });
      q.push({ type: "section_done", heading: sec.heading, words });
      q.push({
        type: "stats",
        words: sections.reduce((a, s) => a + s.words, 0),
        elapsedMs: Date.now() - startedAt,
      });
    }

    // ── GLOBAL LENGTH ENFORCEMENT (expansion pass) ──────────────────────────
    let totalWords = sections.reduce((a, s) => a + s.words, 0);
    const targetTotal = preset.targetWords;
    if (totalWords < targetTotal * 0.82 && !hitWordCap) {
      const expandCount = Math.min(
        Math.max(3, Math.ceil(sections.length / 4)),
        10
      );
      q.push({
        type: "expansion",
        message: `Draft is ${totalWords.toLocaleString()} words — below the ${targetTotal.toLocaleString()}-word target. Expanding the ${expandCount} thinnest sections …`,
      });
      const thin = [...sections]
        .sort((a, b) => a.words / a.target - b.words / b.target)
        .slice(0, expandCount);
      for (const sec of thin) {
        if (totalWords >= preset.maxWords * 0.98) break; // respect the cap
        const addWords = Math.max(
          120,
          Math.round(sec.target * 0.7 - sec.words)
        );
        try {
          const extra = await expandSection(
            sec.heading,
            sec.markdown,
            addWords,
            plan.title,
            req,
            context,
            kbContext
          );
          if (extra && countWords(extra) > 60) {
            sec.markdown = sec.markdown.trimEnd() + "\n\n" + extra.trim();
            sec.words = countWords(sec.markdown);
            q.push({ type: "content", text: extra.trim() + "\n\n" });
          }
        } catch {
          /* non-fatal */
        }
      }
      totalWords = sections.reduce((a, s) => a + s.words, 0);
    }

    // ── 6. FINALIZE ─────────────────────────────────────────────────────────
    q.push({
      type: "stage",
      stage: "finalize",
      message: "Embedding photographs, adding references, saving …",
    });

    // Insert image embeds for photo sections that lack them (uses the same
    // section→photo mapping as the writer so images always land correctly)
    const embedFor = (img: EssayImageDTO) =>
      `![${img.caption.replace(/[[\]]/g, "")}](${img.url})`;
    for (const [secIdx, photoNum] of photoSectionMap.entries()) {
      if (photoNum > images.length) continue;
      const sec = sections[secIdx];
      const img = images[photoNum - 1];
      if (!sec || !img) continue;
      const token = new RegExp(`\\{\\{PHOTO_${photoNum}\\}\\}`, "i");
      if (token.test(sec.markdown)) {
        sec.markdown = sec.markdown.replace(token, embedFor(img));
      } else if (!sec.markdown.includes(img.url)) {
        // insert right after the heading line
        const lines = sec.markdown.split("\n");
        let insertAt = 0;
        for (let li = 0; li < Math.min(3, lines.length); li++) {
          if (lines[li].startsWith("#")) {
            insertAt = li + 1;
            break;
          }
        }
        lines.splice(insertAt, 0, "", embedFor(img), "");
        sec.markdown = lines.join("\n");
      }
    }
    // strip any leftover tokens
    for (const sec of sections) {
      sec.markdown = sec.markdown.replace(/\{\{PHOTO_\d+\}\}/gi, "").replace(/\n{3,}/g, "\n\n");
    }

    // For standard essay mode: distribute found/generated images across
    // sections so the essay is visually illustrated (embed after section end).
    if (!isPhotoEssay && images.length > 0) {
      const usable = Math.min(images.length, Math.max(1, sections.length - 1));
      const step = Math.max(1, Math.floor((sections.length - 1) / usable));
      for (let k = 0; k < usable; k++) {
        const secIdx = Math.min(sections.length - 1, (k + 1) * step);
        const img = images[k];
        if (img && !sections[secIdx].markdown.includes(img.url)) {
          sections[secIdx].markdown =
            sections[secIdx].markdown.trimEnd() +
            `\n\n${embedFor(img)}\n\n*${img.caption}*`;
        }
      }
    }

    // assemble final markdown
    const usedSourceIds = new Set<string>();
    const usedKbIds = new Set<string>();
    for (const sec of sections) {
      for (const m of sec.markdown.matchAll(/\[(S\d+)\]/g)) {
        usedSourceIds.add(m[1]);
      }
      for (const m of sec.markdown.matchAll(/\[(K\d+)\]/g)) {
        usedKbIds.add(m[1]);
      }
    }
    const parts: string[] = [`# ${plan.title}`, ""];
    parts.push(
      `*${isPhotoEssay ? "A photo essay" : "A research essay"} • ${totalWords.toLocaleString()} words • ${images.length} photographs • ${pages.length} sources read${kbSelected.length > 0 ? ` • ${kbSelected.length} knowledge-base passages` : ""}*`
    );
    parts.push("");
    for (const sec of sections) parts.push(sec.markdown.trim(), "");
    if (webSources.length > 0) {
      parts.push("## References", "");
      const citedWeb = webSources.filter((s) => usedSourceIds.has(s.id));
      const list = (citedWeb.length > 0 ? citedWeb : webSources).slice(0, 15);
      for (const s of list) {
        parts.push(`- **${s.id}**. [${s.title}](${s.url})`);
      }
      parts.push("");
    }
    if (kbSources.length > 0) {
      parts.push("### Knowledge base passages (curated RAG corpus)", "");
      const citedKb = kbSources.filter((s) => usedKbIds.has(s.id));
      const kbList = (citedKb.length > 0 ? citedKb : kbSources).slice(0, 12);
      for (const s of kbList) {
        parts.push(`- **${s.id}**. ${s.title} — *${s.domain}*`);
      }
      parts.push("");
    }
    if (images.length > 0) {
      parts.push("## Photograph Credits", "");
      images.forEach((img, i) => {
        parts.push(
          `- **Frame ${i + 1}** — ${img.caption} (${img.credit}${
            img.credit === "AI-generated" ? " illustrative photograph" : ""
          })`
        );
      });
    }
    const markdown = separateImageLines(parts.join("\n")).trim();

    const stats: SessionStats = {
      words: totalWords,
      elapsedMs: Date.now() - startedAt,
      sourcesRead: pages.length,
      queriesRun: req.useWeb ? Math.min(plan.queries.length, preset.queries + 2) : 0,
      imagesGenerated: images.length,
      sections: sections.length,
      kbHits: kbSelected.length,
    };

    // persist images
    for (const img of images) {
      const fileName = img.url.split("/").pop() ?? "";
      await db.essayImage.create({
        data: {
          sessionId,
          fileName,
          url: img.url,
          remoteUrl: null,
          caption: img.caption,
          credit: img.credit,
          prompt: img.prompt ?? null,
          order: img.order,
        },
      });
    }

    await db.researchSession.update({
      where: { id: sessionId },
      data: {
        status: "done",
        title: plan.title,
        markdown,
        sourcesJson: JSON.stringify(sources),
        statsJson: JSON.stringify(stats),
        wordCount: totalWords,
        imageCount: images.length,
      },
    });

    q.push({
      type: "done",
      sessionId,
      title: plan.title,
      kind: "research",
      markdown,
      images,
      sources,
      stats,
    });
  } catch (e: any) {
    const message = e instanceof Error ? e.message : String(e);
    try {
      await db.researchSession.update({
        where: { id: sessionId },
        data: { status: "error", error: message.slice(0, 500) },
      });
    } catch {
      /* ignore */
    }
    q.push({ type: "error", message: `Research pipeline error: ${message}` });
  }
}
