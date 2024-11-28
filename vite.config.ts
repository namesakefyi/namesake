/// <reference types="vitest" />

import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, coverageConfigDefaults } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), tsconfigPaths(), react()],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  css: {
    postcss: {
      plugins: [autoprefixer(), tailwindcss(), cssnano()],
    },
  },
  test: {
    environment: "edge-runtime",
    environmentMatchGlobs: [
      ["convex/**", "edge-runtime"],
      ["**", "jsdom"],
    ],
    server: { deps: { inline: ["convex-test"] } },
    exclude: [...configDefaults.exclude, "e2e/**"],
    coverage: {
      reporter: ["text", "json-summary", "json"],
      reportOnFailure: true,
      include: ["src/**", "convex/**"],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/*.config.?(c|m)[jt]s?(x)",
        "convex/_generated/**",
        "src/routeTree.gen.ts",
        "**/*.stories.tsx",
        "src/components/**/index.ts",
      ],
    },
  },
});
