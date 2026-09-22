import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import type { EssayImageDTO, SourceDTO } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await db.researchSession.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!session) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }

  let sources: SourceDTO[] = [];
  try {
    sources = JSON.parse(session.sourcesJson ?? "[]");
  } catch {
    sources = [];
  }

  const images: EssayImageDTO[] = session.images.map((img) => ({
    id: img.id,
    url: img.url,
    downloadUrl: `${img.url}${img.url.includes("?") ? "&" : "?"}download=1`,
    caption: img.caption,
    credit: img.credit,
    prompt: img.prompt ?? undefined,
    order: img.order,
  }));

  return Response.json({
    id: session.id,
    topic: session.topic,
    mode: session.mode,
    kind: session.kind,
    depth: session.depth,
    status: session.status,
    title: session.title,
    markdown: session.markdown,
    notes: session.notes,
    wordCount: session.wordCount,
    createdAt: session.createdAt,
    images,
    sources,
    messages: session.messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt,
    })),
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await db.researchSession.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }
}
