import type { SourceDTO } from "@/lib/types";

export interface SearchResultItem {
  url: string;
  name: string;
  snippet: string;
  host_name: string;
  date?: string;
}

/** Web search using DuckDuckGo HTML endpoint */
export async function webSearch(
  query: string,
  num = 8
): Promise<SearchResultItem[]> {
  try {
    const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    });
    const html = await res.text();
    const out: SearchResultItem[] = [];
    
    // Parse DDG HTML
    const blockRegex = /<a class="result__url" href="([^"]+)">[\s\S]*?<\/a>[\s\S]*?<a class="result__snippet[^>]*>([\s\S]*?)<\/a>/g;
    let match;
    while ((match = blockRegex.exec(html)) !== null && out.length < num) {
      let url = match[1];
      if (url.startsWith('//')) {
         url = 'https:' + url;
      }
      try {
        out.push({
          url: url,
          name: new URL(url).hostname,
          snippet: match[2].replace(/<[^>]+>/g, "").trim(),
          host_name: new URL(url).hostname
        });
      } catch (e) {}
    }
    return out;
  } catch {
    return [];
  }
}

export interface ReadPage {
  title: string;
  url: string;
  text: string;
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|blockquote)>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Read a web page directly via fetch and return clean text. */
export async function readPage(url: string): Promise<ReadPage | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } });
    if (!res.ok) return null;
    const html = await res.text();
    const text = htmlToText(html);
    if (text.length < 400) return null;
    return {
      title: url,
      url: url,
      text: text.slice(0, 8000), // cap per page to keep context manageable
    };
  } catch {
    return null;
  }
}

/** Assign source IDs (S1..Sn) to unique URLs. */
export function toSourceDTOs(
  items: { url: string; title: string; snippet: string }[]
): SourceDTO[] {
  const seen = new Set<string>();
  const out: SourceDTO[] = [];
  for (const item of items) {
    if (!item.url || seen.has(item.url)) continue;
    seen.add(item.url);
    out.push({
      id: `S${out.length + 1}`,
      title: item.title || item.url,
      url: item.url,
      snippet: (item.snippet || "").slice(0, 280),
    });
  }
  return out;
}

/** Build a compact research context block from read pages for the writer LLM. */
export function buildResearchContext(
  pages: ReadPage[],
  maxTotalChars = 26000
): string {
  const perPage = Math.max(2200, Math.floor(maxTotalChars / Math.max(1, pages.length)));
  const blocks = pages.map((p, i) => {
    return `### SOURCE S${i + 1}: ${p.title}\nURL: ${p.url}\n${p.text.slice(0, perPage)}`;
  });
  return blocks.join("\n\n---\n\n").slice(0, maxTotalChars);
}
