const { config } = require("@swc/core/spack");
const { resolve } = require("node:path");

const distPath = resolve(__dirname, "dist");
const srcPath = resolve(__dirname, "src");

module.exports = config({
  entry: {
    index: resolve(srcPath, "index.tsx"),
    document: resolve(srcPath, "document.tsx"),
  },
  output: {
    path: distPath,
  },
  module: {},
  options: {
    sourceMaps: true,
    outputPath: distPath,
    // All options below can be configured via .swcrc
    jsc: {
      parser: {
        syntax: "typescript",
        tsx: true,
      },
      transform: {
        react: {
          development: true,
          runtime: "automatic",
        },
      },
    },
  },
});
