import { resolve } from "path";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  resolve: {
    alias: {
      "@/": `${resolve(__dirname, "client-src", "components", "better-prompt")}/`,
      "%/": `${resolve(__dirname, "client-src", "components", "widgets")}/`,
      "#/": `${resolve(__dirname, "client-src", "libs")}/`,
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
  },
  plugins: [svelte()],
});
