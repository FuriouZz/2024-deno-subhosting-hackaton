/** @jsx jsx */
import { fromFileUrl } from "$std/path/from_file_url.ts";
import { relative } from "$std/path/relative.ts";
import { Hono } from "$hono/mod.ts";
import { jsx } from "$hono/jsx/index.ts";
import Client from "server/subhosting.ts";
import { expandGlobSync } from "$lume/deps/fs.ts";
import { dirname } from "$lume/deps/path.ts";

const client = new Client();
const app = new Hono();

const routePath = fromFileUrl(import.meta.resolve("./routes"));
const routes = new Map<string, string>();
const files = expandGlobSync(`${routePath}/**/*`);

for (const file of files) {
  if (file.isFile && /(j|t)sx?$/.test(file.name)) {
    file.path;

    const path = relative(
      routePath,
      file.path,
    );

    if (/^index\.(j|t)sx?$/.test(file.name)) {
      routes.set(`/${dirname(path).replace(".", "")}`, file.path);
    } else {
      routes.set(`/${path.replace(/\.(j|t)sx?$/, "")}`, file.path);
    }
  }
}

async function handler(importPath: string) {
  const projects = await (await client.listProjects()).json();

  const { default: App } = await import(routes.get("/_app")!);
  const { default: Component } = await import(importPath);

  return <App {...{ Component, projects }} />;
}

for (const [path, importPath] of routes.entries()) {
  if (path.startsWith("_")) continue;

  if (importPath.endsWith("x")) {
    app.get(path, async (ctx) => {
      const html = await handler(importPath);
      return ctx.html(html);
    });
  } else {
    const module = await import(importPath);
    app.route(path, module.default);
  }
}

app.notFound(async (ctx) => {
  const html = await handler(routes.get("/404")!);
  return ctx.html(html);
});

export default app;
