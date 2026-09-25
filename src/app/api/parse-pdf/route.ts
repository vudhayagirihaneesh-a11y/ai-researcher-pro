import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File exceeds 5MB limit" },
        { status: 400 }
      );
    }

    const type = file.type || "";
    let text = "";

    if (type === "application/pdf") {
      const pdf = require("pdf-parse");
      const buffer = await file.arrayBuffer();
      const data = await pdf(Buffer.from(buffer));
      text = data.text;
    } else if (type === "text/plain") {
      text = await file.text();
    } else if (type.startsWith("image/")) {
      const Tesseract = require("tesseract.js");
      const os = require("os");
      const buffer = await file.arrayBuffer();
      const { data } = await Tesseract.recognize(Buffer.from(buffer), "eng", {
        cachePath: os.tmpdir(),
        cacheMethod: "write",
      });
      text = data.text;
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Only PDF, TXT, and Images (PNG/JPG) are supported." },
        { status: 400 }
      );
    }

    return NextResponse.json({ text });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to parse file" },
      { status: 500 }
    );
  }
}
