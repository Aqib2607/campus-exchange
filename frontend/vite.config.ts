// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import fs from "node:fs";

// Monkey patch fs.rmSync to bypass Windows EPERM / EBUSY locks during build
const originalRmSync = fs.rmSync;
fs.rmSync = (path, options) => {
  try {
    originalRmSync(path, options);
  } catch (e: any) {
    if (e.code !== "EPERM" && e.code !== "EBUSY") throw e;
    console.warn(`[Build Patch] Swallowed ${e.code} for ${path}`);
  }
};

export default defineConfig({
  vite: {
    base: "/",
    build: {
      emptyOutDir: false,
    },
    plugins: [
      {
        name: 'disable-empty-out-dir',
        enforce: 'pre',
        config(config) {
          if (config.build) config.build.emptyOutDir = false;
          if (config.environments?.['ssr']?.build) {
             config.environments['ssr'].build.emptyOutDir = false;
          }
        }
      }
    ],
    environments: {
      ssr: {
        build: {
          emptyOutDir: false,
        },
      },
    },
  },
  tanstackStart: {
    ssr: false,
    server: { entry: "server" },
  },
  nitro: {
    preset: "node-server",
    output: {
      dir: ".build_output",
    },
  },
});
