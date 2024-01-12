import { join } from "$std/path/join.ts";
import { encodeBase64 } from "$hono/utils/encode.ts";

interface IAsset {
  kind: "file" | "symlink";
  encoding: "utf-8" | "base64";
  content?: string;
  gitSha1?: string;
}

export default async function build(posts: Record<string, string>) {
  const assets: Record<string, IAsset> = {};

  const { default: site } = await import("./config.ts");

  Object.entries(posts).forEach(([key, value]) => {
    site.remoteFile(key, `data:text/plain;base64,${btoa(value)}`);
  });

  const filenames = Object.keys(posts);
  site.preprocess([".md"], (pages) => {
    pages.forEach((page) => {
      if (page.src.entry?.name && filenames.includes(page.src.entry.name)) {
        delete page.src.entry;
      }
    });
  });

  const files: string[] = [];
  site.addEventListener("afterBuild", ({ pages, staticFiles }) => {
    pages.forEach((page) => {
      files.push(page.outputPath);
    });
    staticFiles.forEach((s) => {
      files.push(s.outputPath);
    });
  });
  await site.build();

  // console.log([...site.fs.entries.keys()]);

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
    content: Deno.readTextFileSync(join(site.src(), "serve.ts")),
  };

  return assets;
}
