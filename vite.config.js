import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@/": `${resolve(__dirname, "client-src")}/`,
    },
  },
  build: {
    outDir: resolve(__dirname, "dist"),
    lib: {
      entry: resolve(__dirname, "client-src/main.ts"),
      name: "BetterPrompt",
      formats: ["iife"],
      fileName: () => "betterPrompt.js",
    },
    watch: {
      include: resolve(__dirname, "client-src"),
    },
  },
});
