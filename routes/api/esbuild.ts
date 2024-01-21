import { Hono } from "hono/mod.ts";

const app = new Hono();

if (Deno.args.includes("--dev")) {
  // Poll deployment data from Subhosting API
  app.get("/", async (ctx) => {
    return ctx.redirect("http://localhost:3000/esbuild");
  });
}

export default app;
