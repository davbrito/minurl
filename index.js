import { bundle } from "@swc/core";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticNodeStream } from "react-dom/server";

const distPath = fileURLToPath(new URL("./dist/", import.meta.url));
const srcPath = fileURLToPath(new URL("./src/", import.meta.url));

const result = await bundle(resolve("spack.config.cjs"));

try {
  await mkdir(distPath);
} catch (e) {
  await rm(distPath, { recursive: true });
  await mkdir(distPath);
}

for (let [file, output] of Object.entries(result)) {
  file = `${file}.js`;
  await writeFile(resolve(distPath, file), output.code);
  await writeFile(resolve(distPath, `${file}.map`), output.map);
}

const { default: Document } = await import("./dist/document.js");

await writeFile(
  resolve(distPath, "index.html"),
  renderToStaticNodeStream(
    createElement(Document, {
      scriptSrc: "index.js",
    })
  )
);
