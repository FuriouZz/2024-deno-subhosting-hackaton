import { Hono } from "$hono/mod.ts";
import routes from "server/routes.tsx";

const app = new Hono();

app.route("/", routes);

Deno.serve(app.fetch);
