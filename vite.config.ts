import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import webpackStatsPlugin from "rollup-plugin-webpack-stats";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
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
      },
    },
  },
  plugins: [
    TanStackRouterVite(),
    tsconfigPaths(),
    react(),
    webpackStatsPlugin(),
  ],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  css: {
    postcss: {
      plugins: [autoprefixer(), tailwindcss(), cssnano()],
    },
  },
  test: {
    globals: true,
    workspace: [
      {
        extends: true,
        test: {
          name: "convex",
          include: ["convex/**/*.test.ts"],
          environment: "edge-runtime",
        },
      },
      {
        extends: true,
        test: {
          name: "components",
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
        "src/components/**/index.ts",
      ],
    },
    setupFiles: ["./tests/vitest.setup.ts"],
    server: {
      deps: {
        inline: ["convex-test"],
      },
    },
  },
});
