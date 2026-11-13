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

export default defineConfig({
  plugins: [react(), cesiumStaticAssets()],
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 6000,
  },
});
