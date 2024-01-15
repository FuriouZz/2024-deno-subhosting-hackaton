import { Hono } from "$hono/mod.ts";
import { streamSSE } from "$hono/helper/streaming/sse.ts";
import watchClient from "server/client.ts";

const app = new Hono();
let changed = false;
const listeners = await watchClient();
listeners.add(() => {
  console.log("Changes detected...");
  changed = true;
});

// deno-lint-ignore require-await
app.get("/", async (ctx) => {
  ctx.header("Content-Type", "text/event-stream");
  ctx.header("Cache-Control", "no-cache");
  ctx.header("Connection", "keep-alive");

  let id = 0;
  return streamSSE(ctx, async (stream) => {
    while (true) {
      if (changed) {
        changed = false;
        await stream.writeSSE({
          data: "change",
          event: "change",
          id: String(id++),
        });
      }
      await stream.writeSSE({
        data: `It is ${new Date().toISOString()}`,
        event: "time-update",
        id: String(id++),
      });
      await stream.sleep(1000);
    }
  });
});

export default app;
