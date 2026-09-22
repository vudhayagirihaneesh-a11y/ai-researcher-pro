// Full CJP photo essay run — the user's requested deliverable.
// 12 photos (>10 required), ~2400 words, constitutional enrichment.
const BASE = "http://localhost:3000";
const OUT = "/home/z/my-project/data/cjp-photo-essay-result.json";

async function main() {
  console.log("=== CJP PHOTO ESSAY — FULL RUN ===", new Date().toISOString());
  const res = await fetch(`${BASE}/api/research`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic:
        "The CJP (Cockroach Janata Party) student protest in Delhi, 2026 — a photo essay",
      mode: "photo-essay",
      speed: "fast",
      useWeb: true,
      notes:
        "Photo essay documenting the 2026 CJP (Cockroach Janata Party) student protest in Delhi: what sparked it, the march, the sit-ins, negotiations and aftermath. MUST be enriched with the Articles of the Constitution of India — Article 19(1)(a) freedom of speech and expression, Article 19(1)(b) right to peaceful assembly without arms, Articles 19(2)-(4) reasonable restrictions, Article 14 equality before law, Article 21 right to life and personal liberty including dignity and education, Article 21A right to education, Article 32 constitutional remedies (moving the Supreme Court), Article 226 High Court writs, Article 51A fundamental duties, and Directive Principles (Article 45). Each photograph's paragraph should connect the image to the constitutional story of Indian student protest.",
    }),
  });

  if (!res.ok) {
    console.log("HTTP", res.status, await res.text());
    process.exit(1);
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const t0 = Date.now();
  let markdown = "";
  let images: any[] = [];
  let finished = false;

  while (!finished) {
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
        const ts = ((Date.now() - t0) / 1000).toFixed(0);
        switch (evt.type) {
          case "stage":
            console.log(`[${ts}s] STAGE ${evt.stage}: ${evt.message}`);
            break;
          case "stage_detail":
            console.log(`  · ${evt.message}`);
            break;
          case "search_result":
            console.log(`  · search "${evt.query.slice(0, 60)}" → ${evt.count}`);
            break;
          case "source_read":
            console.log(`  · read: ${evt.title.slice(0, 70)} (${evt.chars})`);
            break;
          case "plan":
            console.log(`  PLAN: "${evt.title}" | ${evt.queries.length} queries | ${evt.outline.length} sections`);
            evt.outline.forEach((o: any) =>
              console.log(`     - ${o.heading} (~${o.targetWords}w)`)
            );
            break;
          case "image_start":
            console.log(`  🖼 [${evt.index}/${evt.total}] ${evt.prompt.slice(0, 100)}...`);
            break;
          case "image_done":
            images.push(evt.image);
            console.log(`  ✅ image ${evt.index ?? images.length}: ${evt.image.url}`);
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
            break;
          case "done":
            markdown = evt.markdown;
            images = evt.images;
            console.log(`\n===== DONE in ${((Date.now() - t0) / 1000 / 60).toFixed(1)} min =====`);
            console.log(`sessionId: ${evt.sessionId}`);
            console.log(`title: ${evt.title}`);
            console.log(`words: ${evt.stats.words} | images: ${evt.images.length} | sources: ${evt.sources.length}`);
            const { writeFileSync } = await import("fs");
            writeFileSync(OUT, JSON.stringify({ ...evt, savedAt: new Date().toISOString() }, null, 2));
            console.log(`saved → ${OUT}`);
            finished = true;
            break;
          case "error":
            console.log(`❌ ERROR: ${evt.message}`);
            process.exit(1);
            break;
        }
      } catch {
        /* skip malformed frame */
      }
    }
  }
}

main().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
