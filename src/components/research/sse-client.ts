/**
 * Minimal SSE-over-fetch client for POST endpoints that respond with a
 * `text/event-stream` body. Frames are separated by a blank line (`\n\n`) and
 * payload lines start with `data: `.
 *
 * The connection is intentionally left open for as long as the server keeps
 * sending — deep research runs take minutes — so no timeout is configured.
 * Cancellation is done through the `AbortSignal`.
 */

export type SSEEventHandler = (event: unknown) => void;

export async function streamSSE(
  url: string,
  body: unknown,
  signal: AbortSignal,
  onEvent: SSEEventHandler,
): Promise<void> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok || !res.body) {
    let detail = "";
    try {
      const text = (await res.text()).slice(0, 600);
      try {
        const parsed = JSON.parse(text) as { error?: string; message?: string };
        detail = parsed.error ?? parsed.message ?? "";
      } catch {
        // HTML error page — strip tags and collapse whitespace for readability.
        detail = text
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 160);
      }
    } catch {
      // ignore body read failures
    }
    throw new Error(
      `Request failed (${res.status}${res.statusText ? ` ${res.statusText}` : ""})${detail ? ` — ${detail}` : ""}`,
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const processFrame = (frame: string) => {
    for (const line of frame.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload) continue;
      try {
        onEvent(JSON.parse(payload));
      } catch {
        // Ignore malformed JSON frames — the stream may contain keep-alives.
      }
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let separator: number;
    while ((separator = buffer.indexOf("\n\n")) !== -1) {
      const frame = buffer.slice(0, separator);
      buffer = buffer.slice(separator + 2);
      processFrame(frame);
    }
  }
  // Flush any trailing frame that wasn't terminated by a blank line.
  buffer += decoder.decode();
  if (buffer.trim().length > 0) processFrame(buffer);
}

/** Narrow an unknown thrown value to an AbortError (user cancelled). */
export function isAbortError(err: unknown): boolean {
  return (
    err instanceof DOMException &&
    err.name === "AbortError"
  ) || (
    typeof err === "object" &&
    err !== null &&
    (err as { name?: unknown }).name === "AbortError"
  );
}

/** Shape of the events emitted by POST /api/chat (subset of the SSE contract). */
export interface ChatSSEEvent {
  type: "content" | "done" | "error";
  text?: string;
  message?: string;
}
