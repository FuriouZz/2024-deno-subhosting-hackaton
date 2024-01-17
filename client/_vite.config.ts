import path from "path";
import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const common: UserConfig = {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };

  if (mode === "lib") {
    return {
      ...common,
      build: {
        cssCodeSplit: true,
        lib: {
          entry: path.resolve(__dirname, "src/main.tsx"),
          name: "main",
          fileName: "main",
          formats: ["es"],
        },
      },
    };
  }

  return {
    ...common,
    server: {
      proxy: {
        "/api": "http://localhost:8000",
      },
    },
  };
});
