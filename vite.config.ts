import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import devtoolsJson from "vite-plugin-devtools-json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    devtoolsJson({ uuid: "38d6a7ee-2322-4d51-97ec-a0e65857b315" }),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    reactRouter(),
    tailwindcss(),
    tsconfigPaths()
  ],
  build: { minify: false },
  environments: {
    ssr: {
      build: { minify: false }
    }
  }
});
