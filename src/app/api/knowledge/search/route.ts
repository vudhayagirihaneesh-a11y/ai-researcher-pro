import { NextRequest } from "next/server";
import { searchKnowledge } from "@/lib/research/rag-engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Search the curated knowledge base (BM25 + phrase boost + domain diversity).
 * GET /api/knowledge/search?q=...&domain=...&limit=20
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").toString().trim();
  const domain = (searchParams.get("domain") ?? "").toString().trim() || undefined;
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get("limit") ?? 20) || 20),
  );

  if (!q) {
    return Response.json({ hits: [], total: 0, query: "" });
  }

  try {
    // Over-fetch so the optional domain filter still fills the page.
    const hits = await searchKnowledge(q, {
      topK: domain ? limit * 4 : limit,
      domain,
      perDomainCap: domain ? limit : 4,
    });
    const sliced = hits.slice(0, limit);
    return Response.json({
      query: q,
      total: hits.length,
      hits: sliced.map((h) => ({
        docId: h.docId,
        title: h.title,
        domain: h.domain,
        source: h.source,
        origin: h.origin,
        content: h.content,
        score: Math.round(h.score * 100) / 100,
      })),
    });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "search failed" },
      { status: 500 },
    );
  }
}
