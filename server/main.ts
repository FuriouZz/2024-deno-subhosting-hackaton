import { Hono } from "$hono/mod.ts";
import { serveStatic } from "$hono/middleware.ts";
import routes from "server/routes.tsx";

const templateHtml = Deno.readTextFileSync("./dist/client/index.html");
// const ssrManifest = Deno.readTextFileSync(
//   "./dist/client/.vite/ssr-manifest.json",
// );

const app = new Hono();

app.route("/", routes);

app.use("/assets/*", serveStatic({ root: "./dist/client/" }));

app.get("*", async (c) => {
  const { render } = await import("../dist/server/entry.server.mjs");

  const rendered = render();

  const html = templateHtml
    .replace(`<!--app-head-->`, rendered.head ?? "")
    .replace(`<!--app-html-->`, rendered.html ?? "");

  return c.html(html);
});

Deno.serve(app.fetch);
