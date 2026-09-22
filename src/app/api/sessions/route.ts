import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const sessions = await db.researchSession.findMany({
    orderBy: { createdAt: "desc" },
    take: 40,
    select: {
      id: true,
      topic: true,
      title: true,
      mode: true,
      kind: true,
      depth: true,
      status: true,
      wordCount: true,
      imageCount: true,
      createdAt: true,
    },
  });
  return Response.json({ sessions });
}
