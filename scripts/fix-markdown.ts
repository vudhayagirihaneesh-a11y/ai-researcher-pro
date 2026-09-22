// Post-process: ensure image-only blocks in stored session markdown
// (prevents <figure>-inside-<p> hydration warnings)
import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

function separateImageLines(md: string): string {
  return md
    .split("\n")
    .map((line) => {
      const m = line.match(/!\[[^\]]*\]\([^)\s]+\)/);
      if (!m || m.index === undefined) return line;
      const before = line.slice(0, m.index).trim();
      const after = line.slice(m.index + m[0].length).trim();
      if (!before && !after) return line;
      return [before, m[0], after].filter(Boolean).join("\n\n");
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

const sessions = await p.researchSession.findMany({
  where: { status: "done" },
  select: { id: true, markdown: true },
});

let fixed = 0;
for (const s of sessions) {
  if (!s.markdown) continue;
  const fixedMd = separateImageLines(s.markdown);
  if (fixedMd !== s.markdown) {
    await p.researchSession.update({
      where: { id: s.id },
      data: { markdown: fixedMd },
    });
    fixed++;
    console.log(`fixed ${s.id}`);
  }
}
console.log(`done — ${fixed} of ${sessions.length} sessions adjusted`);
await p.$disconnect();
