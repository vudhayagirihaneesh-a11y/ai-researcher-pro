import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const MEDIA_DIR = path.join(process.cwd(), "data", "research-media");

export async function ensureMediaDir(): Promise<string> {
  await fs.mkdir(MEDIA_DIR, { recursive: true });
  return MEDIA_DIR;
}

export function mediaPath(fileName: string): string {
  // Prevent path traversal: only allow simple generated names
  const safe = path.basename(fileName);
  return path.join(MEDIA_DIR, safe);
}

export function mediaUrl(fileName: string): string {
  return `/api/media/${fileName}`;
}

export function mediaDownloadUrl(fileName: string): string {
  return `/api/media/${fileName}?download=1`;
}

export async function saveMediaBuffer(
  buffer: Buffer,
  ext = "png"
): Promise<string> {
  await ensureMediaDir();
  const fileName = `${Date.now().toString(36)}-${crypto
    .randomBytes(6)
    .toString("hex")}.${ext}`;
  await fs.writeFile(path.join(MEDIA_DIR, fileName), buffer);
  return fileName;
}

export async function saveMediaBase64(
  base64: string,
  ext = "png"
): Promise<string> {
  const buffer = Buffer.from(base64, "base64");
  return saveMediaBuffer(buffer, ext);
}

export async function readMedia(
  fileName: string
): Promise<Buffer | null> {
  try {
    const safe = path.basename(fileName);
    return await fs.readFile(path.join(MEDIA_DIR, safe));
  } catch {
    return null;
  }
}

const MIME_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export function mimeFor(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  return MIME_BY_EXT[ext] ?? "application/octet-stream";
}

/** Mirror a remote image into the local media store so it always has a
 *  stable, downloadable local URL. Returns the local file name or null. */
export async function mirrorRemoteImage(
  url: string
): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 90000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "image/*,*/*;q=0.8",
      },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) return null;
    const arrayBuf = await res.arrayBuffer();
    if (arrayBuf.byteLength < 2048) return null; // too small to be a real photo
    const ext =
      contentType.includes("jpeg") || contentType.includes("jpg")
        ? "jpg"
        : contentType.includes("webp")
          ? "webp"
          : contentType.includes("gif")
            ? "gif"
            : "png";
    return await saveMediaBuffer(Buffer.from(arrayBuf), ext);
  } catch {
    return null;
  }
}
