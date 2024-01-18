import { Hono } from "$hono/mod.ts";
import { serveStatic } from "$hono/middleware.ts";
import routes from "@/lib/routes.tsx";

const app = new Hono();

app.route("/", routes);
app.use("/*", serveStatic({ root: "./static" }));

Deno.serve(app.fetch);
