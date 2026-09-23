import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const visitorId = req.cookies.get("visitor_id")?.value;

  const sessions = await db.researchSession.findMany({
    where: visitorId ? { browserId: visitorId } : { browserId: "anonymous" },
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
