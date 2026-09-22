import type {
  EssayImageDTO,
  OutlineSection,
  PipelineStage,
  ResearchMode,
  SessionStats,
  SourceDTO,
  SpeedMode,
} from "@/lib/types";
import { SPEED_PRESETS } from "@/lib/types";

// ─── Shared UI state types ───────────────────────────────────────────────────

export type RunStatus = "idle" | "running" | "done" | "error" | "cancelled";

export interface LogLine {
  id: number;
  text: string;
}

export interface PlanInfo {
  title: string;
  queries: string[];
  outline: OutlineSection[];
}

export interface ImageProgress {
  index: number;
  total: number;
  prompt?: string;
}

export interface SectionProgress {
  heading: string;
  index: number;
  total: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Live state of a deep-research run attached to one assistant message. */
export interface ResearchRunState {
  status: RunStatus;
  speed: SpeedMode;
  mode: ResearchMode;
  topic: string;
  currentStage: PipelineStage | null;
  completedStages: PipelineStage[];
  stageMessages: Partial<Record<PipelineStage, string>>;
  plan: PlanInfo | null;
  logLines: LogLine[];
  sources: SourceDTO[];
  images: EssayImageDTO[];
  imageProgress: ImageProgress | null;
  sectionProgress: SectionProgress | null;
  markdown: string;
  stats: SessionStats;
  title: string | null;
  sessionId: string | null;
  error: string | null;
  startedAt: number;
}

/** One message in the chat transcript. */
export interface ChatMsg {
  id: string;
  role: "user" | "assistant";
  kind: "chat" | "research" | "pending";
  content: string; // plain chat text (assistant or user)
  research?: ResearchRunState; // present for research messages
  createdAt: number;
}

export const STAGES: PipelineStage[] = [
  "plan",
  "knowledge",
  "search",
  "read",
  "images",
  "write",
  "finalize",
];

export const STAGE_LABELS: Record<PipelineStage, string> = {
  plan: "Plan",
  knowledge: "Knowledge base",
  search: "Search",
  read: "Read sources",
  images: "Images",
  write: "Write",
  finalize: "Finalize",
};

export const MODE_LABELS: Record<ResearchMode, string> = {
  essay: "Research Essay",
  "photo-essay": "Photo Essay",
};

export const SPEED_ICONS: Record<SpeedMode, "zap" | "gauge" | "rocket"> = {
  fast: "zap",
  medium: "gauge",
  max: "rocket",
};

export function speedLabel(speed: string): string {
  return SPEED_PRESETS[speed as SpeedMode]?.label ?? speed;
}

export function speedTagline(speed: string): string {
  return SPEED_PRESETS[speed as SpeedMode]?.tagline ?? "";
}

/** Display label for a history entry's mode. */
export function sessionModeLabel(mode: string, kind: string): string {
  if (kind === "chat") return "Chat";
  if (mode === "photo-essay") return "Photo Essay";
  if (mode === "essay") return "Research Essay";
  return mode;
}

export const EMPTY_STATS: SessionStats = {
  words: 0,
  elapsedMs: 0,
  sourcesRead: 0,
  queriesRun: 0,
  imagesGenerated: 0,
  sections: 0,
  kbHits: 0,
};

// ─── Formatting helpers ──────────────────────────────────────────────────────

/** Format milliseconds as m:ss (or h:mm:ss for very long runs). */
export function formatElapsed(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "0:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const ss = String(seconds).padStart(2, "0");
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${ss}`;
  }
  return `${minutes}:${ss}`;
}

/** Rough word count for the live counter. */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

/** "Jun 12 · 14:32" style short date for the history list. */
export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })} · ${d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`;
}

/** "01:05 PM" style clock time for chat bubbles. */
export function formatClockTime(ts: number | string): string {
  const d = typeof ts === "number" ? new Date(ts) : new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Display label for an image credit: "AI-generated" vs "Web — …". */
export function isAiCredit(credit: string): boolean {
  return credit.toLowerCase().startsWith("ai");
}

/** Build the download URL for an essay-embedded media src. */
export function toDownloadUrl(src: string): string {
  if (!src.startsWith("/api/media/")) return src;
  return src.includes("?") ? `${src}&download=1` : `${src}?download=1`;
}
