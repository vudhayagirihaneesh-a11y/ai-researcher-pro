// Smoke test: run a small research pipeline through the API and watch SSE events.
const BASE = "http://localhost:3000";

async function main() {
  const mode = process.argv[2] ?? "essay";
  const res = await fetch(`${BASE}/api/research`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic:
        mode === "photo-essay"
          ? "The CJP (Cockroach Janata Party) student protest in Delhi, 2026"
          : "The history of Jantar Mantar as a protest site in Delhi",
      mode,
      speed: "fast",
      useWeb: true,
      notes:
        "Enrich with Articles of the Constitution of India (19, 21, 21A, 32) where relevant.",
    }),
  });

  if (!res.ok && !res.headers.get("content-type")?.includes("event-stream")) {
    console.log("HTTP", res.status, await res.text());
    return;
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const t0 = Date.now();
  let done = false;
  let lastEvtType = "";

  while (!done) {
    const { value, done: d } = await reader.read();
    if (d) break;
    buffer += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buffer.indexOf("\n\n")) !== -1) {
      const frame = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      if (!frame.startsWith("data: ")) continue;
      try {
        const evt = JSON.parse(frame.slice(6));
        lastEvtType = evt.type;
        switch (evt.type) {
          case "stage":
            console.log(`[${((Date.now() - t0) / 1000).toFixed(0)}s] STAGE ${evt.stage}: ${evt.message}`);
            break;
          case "stage_detail":
            console.log(`  · ${evt.message}`);
            break;
          case "search_result":
            console.log(`  · search "${evt.query}" → ${evt.count} results`);
            break;
          case "source_read":
            console.log(`  · read: ${evt.title} (${evt.chars} chars)`);
            break;
          case "plan":
            console.log(`  PLAN title="${evt.title}" queries=${evt.queries.length} sections=${evt.outline.length}`);
            break;
          case "image_start":
            console.log(`  🖼 image ${evt.index}/${evt.total}: ${evt.prompt.slice(0, 80)}...`);
            break;
          case "image_done":
            console.log(`  ✅ image done: ${evt.image.url} (${evt.image.credit})`);
            break;
          case "section_start":
            console.log(`  ✍️  [${evt.index}/${evt.total}] ${evt.heading}`);
            break;
          case "section_done":
            console.log(`     → ${evt.words} words`);
            break;
          case "expansion":
            console.log(`  ⚡ ${evt.message}`);
            break;
          case "stats":
            console.log(`  📊 ${evt.words} words @ ${((Date.now() - t0) / 1000).toFixed(0)}s`);
            break;
          case "done":
            console.log(`\n===== DONE in ${((Date.now() - t0) / 1000).toFixed(0)}s =====`);
            console.log(`sessionId: ${evt.sessionId}`);
            console.log(`title: ${evt.title}`);
            console.log(`words: ${evt.stats.words} | images: ${evt.images.length} | sources: ${evt.sources.length} | sections: ${evt.stats.sections}`);
            console.log(`markdown length: ${evt.markdown.length}`);
            console.log("--- first 600 chars ---");
            console.log(evt.markdown.slice(0, 600));
            console.log("--- image embeds present:", evt.markdown.includes("/api/media/"));
            done = true;
            break;
          case "error":
            console.log(`❌ ERROR: ${evt.message}`);
            done = true;
            break;
          case "heartbeat":
            break;
          default:
            if (evt.type === "content") { /* silent */ }
        }
      } catch (e) {
        console.log("parse err:", frame.slice(0, 100));
      }
    }
  }
  if (!done) console.log("stream ended without done event. last:", lastEvtType);
}

main().catch((e) => console.error("FATAL", e));
