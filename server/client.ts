import * as esbuild from "esbuild/mod.js";

const denojson = JSON.parse(Deno.readTextFileSync("./deno.json"));
const importMap = Object.fromEntries(
  Object.entries(denojson.imports).filter(([key]) => !key.endsWith("/")),
) as Record<string, string>;

const options: esbuild.BuildOptions = {
  alias: importMap,
  entryPoints: ["./client/main.tsx"],
  outfile: "./dist/main.js",
  bundle: true,
  format: "esm",
  jsx: "automatic",
  jsxFactory: "h",
  jsxFragment: "Fragment",
  jsxImportSource: "preact",
};

if (import.meta.main) {
  await esbuild.build(options);
  esbuild.stop();
}

export default async function watchClient() {
  const listeners = new Set<() => void>();

  const ctx = await esbuild.context({
    ...options,
    plugins: [
      {
        name: "hello",
        setup(b) {
          b.onEnd(() => {
            for (const listener of listeners) {
              listener();
            }
          });
        },
      },
    ],
    define: {
      "__USE_LIVE_RELOAD": "true",
    },
  });

  await ctx.serve({ port: 3000 });

  console.log("Watching...");
  await ctx.watch();

  return listeners;
}
