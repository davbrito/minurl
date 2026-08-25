// @ts-check
import js from "@eslint/js";
import eslintReact from "@eslint-react/eslint-plugin";
import { defineConfig } from "eslint/config";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      "worker-configuration.d.ts",
      ".react-router"
    ]
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: [js.configs.recommended]
  },
  {
    files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: { globals: { ...globals.browser } }
  },
  {
    files: [
      "worker/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "eslint.config.js",
      "vite.config.ts"
    ],
    languageOptions: { globals: { ...globals.node } }
  },
  tseslint.configs.recommended,
  eslintReact.configs["recommended-typescript"],
  pluginReactHooks.configs.flat["recommended-latest"],
  {
    rules: {
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ]
    }
  },
  {
    // worker/index.ts imports @hono/session's useSession/useSessionStorage,
    // which look like React hooks by name but aren't - disable hook rules there.
    files: ["worker/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    rules: {
      "@eslint-react/rules-of-hooks": 0,
      "react-hooks/rules-of-hooks": 0
    }
  }
]);
