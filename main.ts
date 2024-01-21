import { Hono } from "hono/mod.ts";
import { serveStatic } from "hono/middleware.ts";
import routes from "@/lib/routes.tsx";

const app = new Hono();

app.route("/", routes);

app.use(
  "/*",
  serveStatic({
    root: "./static",
    rewriteRequestPath(path) {
      return path.replace(/^\/lume/, "/_site");
    },
  }),
);

if (Deno.args.includes("--dev")) {
  import("hono/helper/dev/index.ts").then(({ showRoutes }) => {
    showRoutes(app);
  });
}

Deno.serve(app.fetch);
