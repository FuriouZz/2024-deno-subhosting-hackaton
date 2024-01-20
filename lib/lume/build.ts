import { join } from "std/path/join.ts";
import { encodeBase64 } from "hono/utils/encode.ts";
import { extract } from "lume/deps/front_matter.ts";
import lume from "lume/mod.ts";
import { fromFileUrl } from "lume/deps/path.ts";

interface IAsset {
  kind: "file" | "symlink";
  encoding: "utf-8" | "base64";
  content?: string;
  gitSha1?: string;
}

export default async function build({ themeURL, pages }: {
  themeURL: string;
  pages: Record<string, { body: string; type: "post" | "page"; title: string }>;
}) {
  const assets: Record<string, IAsset> = {};

  const { default: theme } = await import(themeURL);
  const site = lume({ src: "./lib/lume", dest: `./lib/lume/_site` });
  site.use(theme());

  // Register posts and stores urls
  const urls = Object.entries(pages).map(([url, value]) => {
    const valueBody = value.body.trim().startsWith("---")
      ? value.body
      : `---\n---\n${value.body}`;
    const { attrs, body } = extract(valueBody);
    const scope = value.type === "post" ? "/posts" : "/pages";
    console.log(scope);

    site.page({ ...attrs, title: value.title, content: body, url }, scope);
    return url;
  });

  // Fix: Pass markdown pages to (pre)processor with ".md" extension
  site.addEventListener("beforeRender", ({ pages }) => {
    pages
      .filter((page) => urls.includes(page.data.url))
      .forEach((page) => page.src.ext = ".md");
  });

  const files: string[] = [];
  site.addEventListener("afterBuild", ({ pages, staticFiles }) => {
    pages.forEach((page) => files.push(page.outputPath));
    staticFiles.forEach((s) => files.push(s.outputPath));
  });
  await site.build();

  for (const file of files) {
    const path = join("_site", file);
    const srcPath = join(site.dest(), file);
    assets[path] = {
      kind: "file",
      encoding: "base64",
      content: encodeBase64(Deno.readFileSync(srcPath)),
    };
  }

  assets["main.ts"] = {
    kind: "file",
    encoding: "utf-8",
    content: Deno.readTextFileSync(
      fromFileUrl(import.meta.resolve("./serve.ts")),
    ),
  };

  return assets;
}
