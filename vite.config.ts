import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare(), tailwindcss()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
