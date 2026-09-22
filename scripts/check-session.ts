import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const s = await p.researchSession.findFirst({
  orderBy: { createdAt: "desc" },
  select: { id: true, status: true, wordCount: true, imageCount: true, title: true, topic: true },
});
console.log(JSON.stringify(s, null, 2));
const imgs = await p.essayImage.count({ where: { sessionId: s?.id ?? "" } });
console.log("images persisted:", imgs);
await p.$disconnect();
