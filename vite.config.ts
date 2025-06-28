import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import webpackStatsPlugin from "rollup-plugin-webpack-stats";
import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, coverageConfigDefaults } from "vitest/config";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Use a supported file pattern for Vite 5/Rollup 4
        // @doc https://relative-ci.com/documentation/guides/vite-config
        assetFileNames: "assets/[name].[hash][extname]",
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js",
        manualChunks(id: string) {
          // Convex
          if (
            id.includes("convex") ||
            id.includes("convex-helpers") ||
            id.includes("@convex-dev") ||
            id.includes("better-auth")
          ) {
            return "convex";
          }

          // Core component primitives
          if (
            id.includes("@radix-ui") ||
            id.includes("react-aria") ||
            id.includes("react-aria-components")
          ) {
            return "react-aria";
          }

          // Styling and animation utilities
          if (
            id.includes("motion") ||
            id.includes("tw-animate-css") ||
            id.includes("tailwind") ||
            id.includes("tailwind-merge") ||
            id.includes("tailwind-variants") ||
            id.includes("tailwindcss")
          ) {
            return "ui-styling";
          }

          // Icons and visual components
          if (
            id.includes("@maskito") ||
            id.includes("lucide-react") ||
            id.includes("react-random-reveal") ||
            id.includes("sonner")
          ) {
            return "ui-components";
          }

          // Tiptap Editor
          if (
            id.includes("@tiptap") ||
            id.includes("@namesake/tiptap-extensions")
          ) {
            return "@tiptap";
          }

          // Password core and common dictionaries
          if (
            id.includes("@zxcvbn-ts/core") ||
            id.includes("@zxcvbn-ts/language-common")
          ) {
            return "zxcvbn-core";
          }

          // Password english dictionary (large!)
          if (id.includes("@zxcvbn-ts/language-en")) {
            return "zxcvbn-en";
          }

          // USA states and counties dictionary
          if (id.includes("typed-usa-states")) {
            return "usa-states";
          }

          // Language name mappings dictionary
          if (id.includes("language-name-map")) {
            return "language-names";
          }

          // PDF lib
          if (id.includes("@cantoo/pdf-lib")) {
            return "pdf";
          }

          // Analytics
          if (id.includes("posthog-js")) {
            return "analytics";
          }
        },
      },
    },
  },
  plugins: [
    cloudflare(),
    tanstackRouter(),
    tsconfigPaths(),
    react(),
    webpackStatsPlugin(),
    tailwindcss(),
    ViteImageOptimizer(),
  ],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: "backend",
          include: ["convex/**/*.test.ts"],
          environment: "edge-runtime",
        },
      },
      {
        extends: true,
        test: {
          name: "frontend",
          include: ["src/**/*.test.{ts,tsx}"],
          environment: "jsdom",
        },
      },
    ],
    exclude: [...configDefaults.exclude, "tests/**"],
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
        "src/routes/**/*",
        "src/components/**/index.ts",
        "src/components/common/Editor/extensions/**",
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 75,
        lines: 80,
      },
    },
    setupFiles: ["./tests/vitest.setup.ts"],
    server: {
      deps: {
        inline: ["convex-test"],
      },
    },
  },
});
