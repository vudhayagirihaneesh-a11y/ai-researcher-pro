import { NextRequest } from "next/server";
import {
  executePipeline,
  EventQueue,
} from "@/lib/research/pipeline";
import type { ResearchRequest } from "@/lib/types";
import { SPEED_PRESETS } from "@/lib/types";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 1800;

export async function POST(req: NextRequest) {
  let body: Partial<ResearchRequest>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const topic = (body.topic ?? "").toString().trim();
  if (!topic || topic.length < 4) {
    return Response.json(
      { error: "A topic of at least 4 characters is required." },
      { status: 400 }
    );
  }

  const researchReq: ResearchRequest = {
    topic: topic.slice(0, 500),
    mode: body.mode === "photo-essay" ? "photo-essay" : "essay",
    speed:
      body.speed && body.speed in SPEED_PRESETS
        ? body.speed
        : "fast",
    useWeb: body.useWeb !== false,
    notes: (body.notes ?? "").toString().slice(0, 2000) || undefined,
  };

  const queue = new EventQueue();
  const encoder = new TextEncoder();

  // heartbeat keeps the SSE connection alive through proxies during long
  // silent LLM/image operations (never lets the run "die" silently)
  const heartbeat = setInterval(() => {
    queue.push({ type: "heartbeat" });
  }, 9000);

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const evt = await queue.next();
      if (evt === null) {
        controller.close();
        return;
      }
      try {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(evt)}\n\n`)
        );
      } catch {
        /* client gone */
      }
    },
    cancel() {
      clearInterval(heartbeat);
      queue.end();
    },
  });

  // run the pipeline in the background, pushing events into the queue.
  // If the client disconnects, the pipeline keeps running detached and the
  // session is still persisted — the user can reopen it from History.
  (async () => {
    try {
      const session = await db.researchSession.create({
        data: {
          topic: researchReq.topic,
          kind: "research",
          mode: researchReq.mode,
          depth: researchReq.speed,
          status: "running",
          title: topic.slice(0, 90),
        },
      });
      await executePipeline(researchReq, queue, session.id);
    } finally {
      clearInterval(heartbeat);
      queue.end();
    }
  })();

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
