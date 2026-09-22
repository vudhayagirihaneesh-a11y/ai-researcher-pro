import { NextRequest } from "next/server";
import JSZip from "jszip";
import { db } from "@/lib/db";
import { readMedia } from "@/lib/research/media-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return Response.json({ error: "sessionId is required" }, { status: 400 });
  }
  const session = await db.researchSession.findUnique({
    where: { id: sessionId },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!session) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }

  const zip = new JSZip();
  const title = session.title ?? session.topic;

  // essay markdown with relative image links
  if (session.markdown) {
    let md = session.markdown.replace(
      /\]\((\/api\/media\/[^)\s]+)\)/g,
      (_m, p1) => `](photos/${p1.split("/").pop()})`
    );
    zip.file("essay.md", md);
    zip.file(
      "README.txt",
      `${title}\n\nPhoto essay exported from AI Researcher Pro.\n` +
        `- essay.md — the full essay (references photos/ folder)\n` +
        `- photos/ — all photographs, numbered in essay order\n` +
        `- index.html — standalone readable version with embedded images\n` +
        `Topic: ${session.topic}\nWords: ${session.wordCount}\n`
    );
  }

  const photoFolder = zip.folder("photos");
  let index = 0;
  for (const img of session.images) {
    index++;
    const data = await readMedia(img.fileName);
    if (data && photoFolder) {
      const ext = img.fileName.includes(".") ? img.fileName.split(".").pop() : "png";
      photoFolder.file(
        `frame-${String(index).padStart(2, "0")}.${ext}`,
        data
      );
    }
  }

  // standalone html with embedded images
  if (session.markdown) {
    try {
      const res = await fetch(
        `${req.nextUrl.origin}/api/export?sessionId=${sessionId}&format=html`
      );
      if (res.ok) {
        const html = await res.text();
        zip.file("index.html", html);
      }
    } catch {
      /* non-fatal */
    }
  }

  const buffer = await zip.generateAsync({ type: "nodebuffer" });
  const safe =
    title
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 80)
      .toLowerCase() || "research-package";

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${safe}.zip"`,
    },
  });
}
