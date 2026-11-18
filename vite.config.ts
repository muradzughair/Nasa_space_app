import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

/**
 * CesiumJS loads its web workers, star map and other static assets at runtime
 * from CESIUM_BASE_URL (set in src/cesiumBase.ts). This copies them from the
 * installed package into public/cesium once per Cesium version, so both
 * `vite` and `vite build` serve them without an extra plugin.
 */
function cesiumStaticAssets(): Plugin {
  return {
    name: "cesium-static-assets",
    configResolved() {
      const pkgPath = require.resolve("cesium/package.json");
      const version: string = JSON.parse(readFileSync(pkgPath, "utf8")).version;
      const source = path.join(path.dirname(pkgPath), "Build", "Cesium");
      const target = path.join(root, "public", "cesium");
      const stamp = path.join(target, ".version");
      if (existsSync(stamp) && readFileSync(stamp, "utf8") === version) return;
      mkdirSync(target, { recursive: true });
      for (const dir of ["Workers", "ThirdParty", "Assets", "Widgets"]) {
        cpSync(path.join(source, dir), path.join(target, dir), { recursive: true });
      }
      writeFileSync(stamp, version);
    },
  };
}

/**
 * The rendering engine is a separate 4 MB chunk (1.1 MB gzipped) that App
 * imports only after React's first render, so its download used to start
 * after index.js had downloaded, parsed and rendered. A modulepreload hint
 * in index.html starts it alongside index.js instead.
 */
function preloadGlobeChunk(): Plugin {
  let base = "/";
  return {
    name: "preload-globe-chunk",
    apply: "build",
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml: {
      order: "post",
      handler(_html, ctx) {
        const chunk = Object.values(ctx.bundle ?? {}).find((c) => c.type === "chunk" && c.name === "GlobeController");
        return chunk ? [{ tag: "link", attrs: { rel: "modulepreload", crossorigin: true, href: base + chunk.fileName }, injectTo: "head" }] : [];
      },
    },
  };
}

export default defineConfig({
  // "/" for npm run dev; the GitHub Pages build sets VITE_BASE=/Nasa_space_app/ (.github/workflows/pages.yml).
  base: process.env.VITE_BASE || "/",
  plugins: [react(), cesiumStaticAssets(), preloadGlobeChunk()],
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 6000,
  },
});
