import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import {
  configDefaults,
  coverageConfigDefaults,
  defineConfig,
} from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    environmentMatchGlobs: [
      ["convex/**", "edge-runtime"],
      ["**", "jsdom"],
    ],
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "convex/**/*.{test,spec}.{ts,tsx}",
    ],
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
    setupFiles: ["./vitest.setup.ts"],
    server: {
      deps: {
        inline: ["convex-test"],
      },
    },
  },
});
