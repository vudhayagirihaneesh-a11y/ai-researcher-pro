import { chatComplete } from "../src/lib/research/llm";

async function main() {
  console.log("Testing chatComplete...");
  try {
    const out = await chatComplete([{ role: "user", content: "Say the word OK" }]);
    console.log("RESULT:", out);
  } catch (e) {
    console.error("ERROR:", e);
  }
}
main();
