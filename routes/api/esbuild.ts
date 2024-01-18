import { Hono } from "$hono/mod.ts";

const app = new Hono();

// Poll deployment data from Subhosting API
app.get("/", async (ctx) => {
  return ctx.redirect("http://localhost:3000/esbuild");
});

export default app;
