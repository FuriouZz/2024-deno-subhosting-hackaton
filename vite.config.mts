import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const common: UserConfig = {
    // deno-lint-ignore no-explicit-any
    plugins: [react() as any],
    resolve: {
      alias: {
        "@": __dirname + "/src",
      },
    },
  };

  if (mode === "dev") {
    return {
      ...common,
      server: {
        proxy: {
          "/api": "http://localhost:8000",
        },
      },
    };
  }

  return common;
});
