import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    // @ts-expect-error - Turbopack pdf-parse workaround
    const pdf = require("pdf-parse");
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

    const buffer = await file.arrayBuffer();
    const data = await pdf(Buffer.from(buffer));

    return NextResponse.json({ text: data.text });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to parse PDF" },
      { status: 500 }
    );
  }
}
