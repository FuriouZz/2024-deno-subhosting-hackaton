/** @jsx jsx */
import { fromFileUrl } from "std/path/from_file_url.ts";
import { relative } from "std/path/relative.ts";
import { Context, Hono } from "hono/mod.ts";
import { jsx } from "hono/jsx/index.ts";
import { expandGlobSync } from "lume/deps/fs.ts";
import { dirname } from "lume/deps/path.ts";

const app = new Hono();

const routePath = fromFileUrl(import.meta.resolve("../routes"));
const routes = new Map<string, string>();
const files = expandGlobSync(`${routePath}/**/*`);

for (const file of files) {
  if (file.isFile && /(j|t)sx?$/.test(file.name)) {
    let path = relative(
      routePath,
      file.path,
    );

    const dynamicReg = /\[(\w+)\]/;
    let matches: RegExpExecArray | null = null;
    while ((matches = dynamicReg.exec(path)) !== null) {
      const m = matches!;
      path = `${path.slice(0, m.index)}:${m[1]}${
        path.slice(m.index + m[0].length)
      }`;
    }

    if (/^index\.(j|t)sx?$/.test(file.name)) {
      routes.set(
        `/${dirname(path).replace(".", "")}`,
        relative(fromFileUrl(import.meta.resolve("./")), file.path),
      );
    } else {
      routes.set(
        `/${path.replace(/\.(j|t)sx?$/, "")}`,
        relative(fromFileUrl(import.meta.resolve("./")), file.path),
      );
    }
  }
}

async function handler(importPath: string, context: Context) {
  const { default: App } = await import(routes.get("/_app")!);
  const { default: Component } = await import(importPath);
  return <App {...{ Component, context }} />;
}

for (const [path, importPath] of routes.entries()) {
  if (path.startsWith("_")) continue;

  if (importPath.endsWith("x")) {
    app.get(path, async (ctx) => {
      const html = await handler(importPath, ctx);
      return ctx.html(html);
    });
  } else {
    const module = await import(importPath);
    app.route(path, module.default);
  }
}

app.notFound(async (ctx) => {
  const html = await handler(routes.get("/404")!, ctx);
  return ctx.html(html);
});

export default app;
