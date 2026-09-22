// ─────────────────────────────────────────────────────────────────────────────
// Shared API contract between the AI Researcher Pro frontend and backend.
// ─────────────────────────────────────────────────────────────────────────────

export type ResearchMode = "essay" | "photo-essay";
export type SpeedMode = "fast" | "medium" | "max";
export type SessionKind = "research" | "chat";
export type PipelineStage =
  | "plan"
  | "knowledge"
  | "search"
  | "read"
  | "images"
  | "write"
  | "finalize";

export interface ResearchRequest {
  topic: string;
  mode: ResearchMode;
  speed: SpeedMode;
  useWeb: boolean;
  notes?: string; // enrichment notes, e.g. constitutional angles
}

export interface SourceDTO {
  id: string; // S1, S2 ... (web) | K1, K2 ... (knowledge base)
  title: string;
  url: string; // empty string for knowledge-base passages
  snippet: string;
  kind?: "web" | "kb"; // absent in legacy sessions → treated as "web"
  domain?: string; // kb only: corpus domain, e.g. "indian-constitution"
}

export interface EssayImageDTO {
  id: string;
  url: string; // viewable url (/api/media/<file>)
  downloadUrl: string; // /api/media/<file>?download=1
  caption: string;
  credit: string; // "AI-generated" | "Web — <source>"
  prompt?: string;
  order: number;
}

export interface OutlineSection {
  heading: string;
  targetWords: number;
  brief: string;
}

export interface SessionStats {
  words: number;
  elapsedMs: number;
  sourcesRead: number;
  queriesRun: number;
  imagesGenerated: number;
  sections: number;
  kbHits: number; // knowledge-base passages retrieved for grounding
}

export type SSEEvent =
  | { type: "stage"; stage: PipelineStage; message: string }
  | { type: "stage_detail"; message: string }
  | { type: "intent"; intent: "research" | "chat"; mode?: ResearchMode }
  | { type: "session"; sessionId: string; kind: SessionKind }
  | {
      type: "plan";
      title: string;
      queries: string[];
      outline: OutlineSection[];
    }
  | { type: "search_result"; query: string; count: number }
  | {
      type: "kb_result";
      query: string;
      count: number;
      best?: string;
    }
  | { type: "kb_learned"; count: number; total: number }
  | { type: "source_read"; title: string; url: string; chars: number }
  | { type: "sources"; sources: SourceDTO[] }
  | {
      type: "image_start";
      index: number;
      total: number;
      prompt: string;
    }
  | { type: "image_done"; image: EssayImageDTO }
  | {
      type: "section_start";
      heading: string;
      index: number;
      total: number;
    }
  | { type: "content"; text: string }
  | { type: "section_done"; heading: string; words: number }
  | { type: "expansion"; message: string }
  | { type: "stats"; words: number; elapsedMs: number }
  | {
      type: "done";
      sessionId: string;
      title: string;
      kind: SessionKind;
      markdown?: string; // research sessions only
      images?: EssayImageDTO[];
      sources?: SourceDTO[];
      stats?: SessionStats;
    }
  | { type: "error"; message: string }
  | { type: "heartbeat" };

export interface ChatRequest {
  message: string;
  sessionId?: string; // absent → new conversation (server classifies intent)
  speed?: SpeedMode; // used when a new research run is started
  history?: { role: "user" | "assistant"; content: string }[];
}

export interface SessionListItem {
  id: string;
  topic: string;
  title: string | null;
  mode: string; // essay | photo-essay | chat
  kind: string; // research | chat (legacy rows default to research)
  depth: string; // legacy: quick/standard/deep — new: fast/medium/max
  status: string;
  wordCount: number;
  imageCount: number;
  createdAt: string;
}

export interface SessionDetail {
  id: string;
  topic: string;
  mode: string;
  kind: string;
  depth: string;
  status: string;
  title: string | null;
  markdown: string | null;
  notes: string | null;
  wordCount: number;
  createdAt: string;
  images: EssayImageDTO[];
  sources: SourceDTO[];
  messages: ChatHistoryItem[];
}

export interface ChatHistoryItem {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

// ─── Speed presets ───────────────────────────────────────────────────────────
// Three research modes. `maxWords` / `maxImages` are HARD CAPS; `targetWords`
// is what the planner actually aims for within the cap.

export interface SpeedPreset {
  label: string;
  tagline: string;
  maxWords: number;
  maxImages: number;
  targetWords: number;
  essayImages: number; // images gathered for plain (non-photo) essays
  sections: [number, number]; // [min, max] outline section count
  queries: number;
  pagesToRead: number;
  searchResultsPerQuery: number;
  kbPassages: number;
}

export const SPEED_PRESETS: Record<SpeedMode, SpeedPreset> = {
  fast: {
    label: "Fast",
    tagline: "Up to 20k words · 10 photos",
    maxWords: 20000,
    maxImages: 10,
    targetWords: 8000,
    essayImages: 6,
    sections: [8, 12],
    queries: 4,
    pagesToRead: 4,
    searchResultsPerQuery: 6,
    kbPassages: 8,
  },
  medium: {
    label: "Medium",
    tagline: "Up to 50k words · 20 photos",
    maxWords: 50000,
    maxImages: 20,
    targetWords: 18000,
    essayImages: 10,
    sections: [14, 20],
    queries: 6,
    pagesToRead: 6,
    searchResultsPerQuery: 8,
    kbPassages: 12,
  },
  max: {
    label: "Max",
    tagline: "Up to 100k words · 30 photos",
    maxWords: 100000,
    maxImages: 30,
    targetWords: 35000,
    essayImages: 14,
    sections: [24, 32],
    queries: 8,
    pagesToRead: 8,
    searchResultsPerQuery: 10,
    kbPassages: 16,
  },
};

export const SPEED_MODES: SpeedMode[] = ["fast", "medium", "max"];
