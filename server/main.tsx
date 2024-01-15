import { Hono } from "$hono/mod.ts";
import { serveStatic } from "$hono/middleware.ts";
import routes from "server/routes.tsx";

const app = new Hono();

app.route("/", routes);
app.use("/main.js", serveStatic({ path: "./dist/main.js" }));
app.use("/main.css", serveStatic({ path: "./dist/main.css" }));
app.use("/*", serveStatic({ root: "./static" }));

Deno.serve(app.fetch);
