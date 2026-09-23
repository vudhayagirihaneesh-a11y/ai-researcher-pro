import {
  mirrorRemoteImage,
  mediaUrl,
  mediaDownloadUrl,
} from "./media-store";
import type { EssayImageDTO } from "@/lib/types";

// ─── Image search backends (all real web images, no AI generation) ───────────

interface ImageSearchResult {
  original_url: string;
  caption?: string;
  source?: string;
}

/** Search Wikimedia Commons via the MediaWiki API. */
async function searchWikimedia(
  query: string,
  count: number
): Promise<ImageSearchResult[]> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=${Math.min(count, 50)}&piprop=original`,
      { headers: { "User-Agent": "AIResearcherPro/1.0 (educational)" } }
    );
    const data = await res.json();
    if (!data.query || !data.query.pages) return [];

    return Object.values(data.query.pages)
      .map((p: any) => ({
        original_url: p.original?.source as string,
        caption: p.title as string,
        source: "Wikimedia Commons",
      }))
      .filter((r) => !!r.original_url);
  } catch {
    return [];
  }
}

/** Search Wikimedia Commons for images specifically from the commons repository. */
async function searchCommonsApi(
  query: string,
  count: number
): Promise<ImageSearchResult[]> {
  try {
    const res = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=${Math.min(count, 30)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1200`,
      { headers: { "User-Agent": "AIResearcherPro/1.0 (educational)" } }
    );
    const data = await res.json();
    if (!data.query || !data.query.pages) return [];

    return Object.values(data.query.pages)
      .map((p: any) => {
        const info = p.imageinfo?.[0];
        if (!info) return null;
        const url = info.thumburl || info.url;
        if (!url) return null;
        const desc =
          info.extmetadata?.ImageDescription?.value?.replace(/<[^>]+>/g, "") ||
          p.title?.replace("File:", "") ||
          query;
        return {
          original_url: url as string,
          caption: desc.slice(0, 200),
          source: "Wikimedia Commons",
        };
      })
      .filter((r): r is ImageSearchResult => !!r);
  } catch {
    return [];
  }
}

/** Search for images using DuckDuckGo image search (no API key needed). */
async function searchDuckDuckGoImages(
  query: string,
  count: number
): Promise<ImageSearchResult[]> {
  try {
    // Step 1: Get the vqd token from a DDG search
    const tokenRes = await fetch(
      `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        },
      }
    );
    const tokenHtml = await tokenRes.text();
    const vqdMatch = tokenHtml.match(/vqd=['"]([^'"]+)['"]/);
    if (!vqdMatch) return [];
    const vqd = vqdMatch[1];

    // Step 2: Fetch image results using the vqd token
    const imgRes = await fetch(
      `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=size:Large`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
          Referer: "https://duckduckgo.com/",
          Accept: "application/json",
        },
      }
    );
    const imgData = await imgRes.json();
    if (!imgData.results || !Array.isArray(imgData.results)) return [];

    return imgData.results.slice(0, count).map((r: any) => ({
      original_url: r.image || r.thumbnail,
      caption: r.title?.replace(/<[^>]+>/g, "") || query,
      source: r.source || new URL(r.image || r.url || "https://unknown").hostname,
    }));
  } catch {
    return [];
  }
}

/** Search Pexels for free stock photos (no API key, uses HTML scraping). */
async function searchPexels(
  query: string,
  count: number
): Promise<ImageSearchResult[]> {
  try {
    const res = await fetch(
      `https://www.pexels.com/search/${encodeURIComponent(query)}/`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        },
      }
    );
    const html = await res.text();
    const results: ImageSearchResult[] = [];

    // Extract image URLs from Pexels page
    const imgRegex = /data-large-src="([^"]+)"/g;
    let match;
    while ((match = imgRegex.exec(html)) !== null && results.length < count) {
      results.push({
        original_url: match[1],
        caption: query,
        source: "Pexels",
      });
    }

    // Fallback: try src attributes from photo img tags
    if (results.length === 0) {
      const srcRegex = /class="photo-item__img"[^>]*src="([^"]+)"/g;
      while ((match = srcRegex.exec(html)) !== null && results.length < count) {
        results.push({
          original_url: match[1],
          caption: query,
          source: "Pexels",
        });
      }
    }

    return results;
  } catch {
    return [];
  }
}

/** Search Unsplash for photos (no API key, uses page scraping). */
async function searchUnsplash(
  query: string,
  count: number
): Promise<ImageSearchResult[]> {
  try {
    const res = await fetch(
      `https://unsplash.com/s/photos/${encodeURIComponent(query)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        },
      }
    );
    const html = await res.text();
    const results: ImageSearchResult[] = [];

    // Unsplash uses srcset; grab the largest available
    const srcsetRegex = /srcSet="([^"]+)"/g;
    let match;
    while (
      (match = srcsetRegex.exec(html)) !== null &&
      results.length < count
    ) {
      const srcset = match[1];
      // Get the last (largest) URL from the srcset
      const urls = srcset.split(",").map((s) => s.trim().split(" ")[0]);
      const largest = urls[urls.length - 1];
      if (largest && largest.startsWith("http")) {
        results.push({
          original_url: largest,
          caption: query,
          source: "Unsplash",
        });
      }
    }

    return results;
  } catch {
    return [];
  }
}

// ─── Multi-source aggregator ────────────────────────────────────────────────

/** Search multiple sources in parallel for real web images.
 *  De-duplicates by URL and returns up to `count` results. */
export async function imageSearchWeb(
  query: string,
  count: number
): Promise<ImageSearchResult[]> {
  // Fire all sources in parallel for speed
  const [wikimedia, commons, ddg, pexels, unsplash] = await Promise.allSettled([
    searchWikimedia(query, count + 4),
    searchCommonsApi(query, count + 4),
    searchDuckDuckGoImages(query, count + 6),
    searchPexels(query, count + 2),
    searchUnsplash(query, count + 2),
  ]);

  const allResults: ImageSearchResult[] = [];
  for (const result of [ddg, wikimedia, commons, pexels, unsplash]) {
    if (result.status === "fulfilled") {
      allResults.push(...result.value);
    }
  }

  // De-duplicate by URL
  const seen = new Set<string>();
  const unique: ImageSearchResult[] = [];
  for (const r of allResults) {
    if (!r.original_url || seen.has(r.original_url)) continue;
    seen.add(r.original_url);
    unique.push(r);
  }

  return unique.slice(0, count);
}

/** Find REAL web photos, mirror them locally so every image has a stable
 *  downloadable link. Uses multiple search backends for variety and accuracy.
 *  Never generates AI images — returns [] if no real photos are found. */
export async function findWebImages(
  query: string,
  want: number,
  orderOffset = 0
): Promise<EssayImageDTO[]> {
  const results = await imageSearchWeb(query, want + 8); // fetch extras in case some fail to mirror
  const out: EssayImageDTO[] = [];
  for (let i = 0; i < results.length && out.length < want; i++) {
    const r = results[i];
    const localFile = await mirrorRemoteImage(r.original_url);
    if (!localFile) continue; // dead/unreachable — skip, never fake it
    out.push({
      id: `web-${Date.now().toString(36)}-${i}`,
      url: mediaUrl(localFile),
      downloadUrl: mediaDownloadUrl(localFile),
      caption: r.caption?.trim() || `Photo: ${query}`,
      credit: r.source ? `${r.source}` : "Web",
      order: orderOffset + out.length,
    });
  }
  return out;
}

/** Find real web images using multiple search queries for better coverage.
 *  This is used for photo essays where each image needs a specific scene. */
export async function findWebImagesMultiQuery(
  queries: { query: string; caption: string }[],
  wantPerQuery = 1
): Promise<EssayImageDTO[]> {
  const out: EssayImageDTO[] = [];
  for (let qi = 0; qi < queries.length; qi++) {
    const { query, caption } = queries[qi];
    const results = await imageSearchWeb(query, wantPerQuery + 4);
    let found = false;
    for (const r of results) {
      if (found) break;
      const localFile = await mirrorRemoteImage(r.original_url);
      if (!localFile) continue;
      out.push({
        id: `web-${Date.now().toString(36)}-${qi}`,
        url: mediaUrl(localFile),
        downloadUrl: mediaDownloadUrl(localFile),
        caption: caption || r.caption?.trim() || `Photo: ${query}`,
        credit: r.source ? `${r.source}` : "Web",
        order: qi,
      });
      found = true;
    }
  }
  return out;
}
