// @ts-check
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
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
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    rules: {
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "react/prop-types": 0,
      "react/jsx-no-leaked-render": 2
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  }
]);
