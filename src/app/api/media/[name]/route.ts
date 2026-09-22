import { NextRequest } from "next/server";
import { readMedia, mimeFor } from "@/lib/research/media-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const data = await readMedia(name);
  if (!data) {
    return Response.json({ error: "Media not found" }, { status: 404 });
  }
  const download = req.nextUrl.searchParams.get("download") === "1";
  const headers: Record<string, string> = {
    "Content-Type": mimeFor(name),
    "Content-Length": String(data.length),
    "Cache-Control": "public, max-age=31536000, immutable",
  };
  if (download) {
    headers["Content-Disposition"] = `attachment; filename="${name}"`;
  }
  return new Response(new Uint8Array(data), { headers });
}
