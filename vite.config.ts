import react from "@vitejs/plugin-react-swc";
import nesting from "postcss-nesting";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/shorten_url": {
        target: "http://localhost:8788/",
      },
      "/x": {
        target: "http://localhost:8788/",
      },
    },
  },
  css: {
    postcss: {
      plugins: [nesting()],
    },
  },
});
