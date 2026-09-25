export interface ChatMessageInput {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Chat completion with retries + validation. Never returns an empty string
 *  without throwing — the caller can rely on non-empty content. */
export async function chatComplete(
  messages: ChatMessageInput[],
  opts: {
    maxTokens?: number;
    temperature?: number;
    minChars?: number;
    retries?: number;
    onChunk?: (text: string) => void;
  } = {}
): Promise<string> {
  const {
    maxTokens = 4096,
    temperature = 0.6,
    minChars = 1,
    retries = 3,
    onChunk,
  } = opts;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const baseUrl = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "1"
        },
        body: JSON.stringify({
          model: "qwen3:8b",
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          stream: true,
          options: {
            num_predict: maxTokens,
            temperature,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`AI Server connection issue (HTTP ${response.status}). Please ensure the background server is running.`);
      }

      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split("\n");
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() ?? "";
        
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.message?.content) {
              const chunk = parsed.message.content;
              fullText += chunk;
              if (onChunk) onChunk(chunk);
            }
          } catch {
            // ignore malformed lines
          }
        }
      }
      
      // process any remaining buffer
      if (buffer.trim()) {
        try {
          const parsed = JSON.parse(buffer);
          if (parsed.message?.content) {
            fullText += parsed.message.content;
          }
        } catch {}
      }

      let content = stripThinking(fullText);
      
      // If stripping the thought process leaves us with nothing (e.g. the model 
      // hit maxTokens while still thinking), return the raw text. This allows 
      // extractJson to try salvaging JSON from inside the thought block, or 
      // correctly fail and trigger the app's deterministic fallbacks without 
      // hanging for 15 minutes of retries.
      if (content.trim().length < minChars) {
        content = fullText;
      }
      
      if (content && content.trim().length >= minChars) {
        return content.trim();
      }
      lastError = new Error(
        `LLM returned ${content.trim().length} chars (min ${minChars})`
      );
    } catch (e: any) {
      lastError = e instanceof Error ? e : new Error(String(e));
    }
    if (attempt < retries) {
      await new Promise((r) => setTimeout(r, 1200 * attempt));
    }
  }
  throw new Error(`AI generation failed after ${retries} attempts: ${lastError?.message}`);
}

/** Extract the first JSON object from an LLM response (handles code fences,
 *  leading prose, trailing commentary). */
export function extractJson<T = any>(text: string): T | null {
  if (!text) return null;
  // strip code fences
  let t = text.replace(/```(?:json)?/gi, "```");
  const fenceMatch = t.match(/```([\s\S]*?)```/);
  if (fenceMatch) t = fenceMatch[1];
  const start = t.indexOf("{");
  if (start === -1) return null;
  // find matching closing brace from the end
  const end = t.lastIndexOf("}");
  if (end <= start) return null;
  const candidate = t.slice(start, end + 1);
  try {
    return JSON.parse(candidate) as T;
  } catch {
    // try progressive trim (common: trailing commas / comments)
    try {
      return JSON.parse(candidate.replace(/,\s*([}\]])/g, "$1"));
    } catch {
      return null;
    }
  }
}

export function countWords(text: string): number {
  return text
    .replace(/[#*_`>\[\]()!|-]/g, " ")
    .split(/\s+/)
    .filter((w) => /[a-zA-Z0-9\u0900-\u097F]/.test(w)).length;
}

/** Strip <think> blocks from model output if present. */
export function stripThinking(text: string): string {
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<think>[\s\S]*$/i, "")
    .trim();
}
