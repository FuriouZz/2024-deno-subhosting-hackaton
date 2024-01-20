import * as esbuild from "esbuild/mod.js";
import { denoPlugins } from "esbuild_deno_loader/mod.ts";
import { fromFileUrl } from "$lume/deps/path.ts";

const options: esbuild.BuildOptions = {
  plugins: [
    ...denoPlugins({
      configPath: fromFileUrl(import.meta.resolve("./deno.jsonc")),
    }),
  ],
  entryPoints: ["./islands/main.js"],
  outfile: "./static/main.js",
  bundle: true,
  format: "esm",
  define: {
    "__USE_LIVE_RELOAD": Deno.args.includes("--watch") ? "true" : "false",
  },
};

if (Deno.args.includes("--watch")) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  const serve = await ctx.serve({ port: 3000, servedir: "./static" });

  console.log(`Serving internally on ${serve.host}:${serve.port}`);
  console.log("Watching...");
} else {
  await esbuild.build(options);
  esbuild.stop();
}
