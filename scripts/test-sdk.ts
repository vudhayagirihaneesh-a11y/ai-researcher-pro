import ZAI from "z-ai-web-dev-sdk";

async function main() {
  const zai = await ZAI.create();

  // 1. Test streaming support
  try {
    const stream = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: "You are terse." },
        { role: "user", content: "Say exactly: streaming works" },
      ],
      thinking: { type: "disabled" },
      stream: true,
    });
    let chunks = 0;
    let text = "";
    for await (const chunk of stream as AsyncIterable<any>) {
      const delta = chunk?.choices?.[0]?.delta?.content ?? "";
      if (delta) {
        chunks++;
        text += delta;
      }
    }
    console.log("STREAM_OK chunks=" + chunks + " text=" + JSON.stringify(text));
  } catch (e: any) {
    console.log("STREAM_FAIL: " + e.message);
  }

  // 2. Test web search
  try {
    const results = await zai.functions.invoke("web_search", {
      query: "student protest Delhi constitution Article 19",
      num: 3,
    });
    console.log(
      "SEARCH_OK count=" +
        (Array.isArray(results) ? results.length : JSON.stringify(results).slice(0, 200))
    );
  } catch (e: any) {
    console.log("SEARCH_FAIL: " + e.message);
  }

  // 3. Test image generation
  try {
    const img = await zai.images.generations.create({
      prompt: "a red apple on a white table, studio photo",
      size: "1024x1024",
    });
    const b64 = img?.data?.[0]?.base64;
    console.log("IMAGE_OK len=" + (b64 ? b64.length : 0));
  } catch (e: any) {
    console.log("IMAGE_FAIL: " + e.message);
  }
}

main().catch((e) => console.error("FATAL", e));
