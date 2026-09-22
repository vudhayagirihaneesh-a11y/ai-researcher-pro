import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Corpus statistics for the knowledge explorer + hero strip. */
export async function GET() {
  try {
    const [total, learned, domainRows, recentLearned] = await Promise.all([
      db.knowledgeChunk.count(),
      db.knowledgeChunk.count({ where: { origin: "web" } }),
      db.knowledgeChunk.groupBy({
        by: ["domain"],
        _count: { domain: true },
        orderBy: { _count: { domain: "desc" } },
      }),
      db.knowledgeChunk.findMany({
        where: { origin: "web" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          docId: true,
          title: true,
          domain: true,
          source: true,
          createdAt: true,
        },
      }),
    ]);

    return Response.json({
      total,
      learned,
      seeded: total - learned,
      domains: domainRows.map((r) => ({
        domain: r.domain,
        count: r._count.domain,
      })),
      recentLearned,
    });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "stats failed" },
      { status: 500 },
    );
  }
}
