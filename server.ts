import { Hono } from "$hono/mod.ts";
import { serveStatic } from "$hono/middleware.ts";
import routes from "server/routes.tsx";

const templateHtml = Deno.readTextFileSync("./client/dist/client/index.html");
// const ssrManifest = Deno.readTextFileSync(
//   "./client/dist/client/.vite/ssr-manifest.json",
// );

const app = new Hono();

app.route("/", routes);

app.use("/assets/*", serveStatic({ root: "./client/dist/client/" }));

app.get("*", async (c) => {
  const { render } = await import("./client/dist/server/entry.server.js");

  const rendered = render();

  const html = templateHtml
    .replace(`<!--app-head-->`, rendered.head ?? "")
    .replace(`<!--app-html-->`, rendered.html ?? "");

  return c.html(html);
});

Deno.serve(app.fetch);
