import {
  configDefaults,
  coverageConfigDefaults,
  defineConfig,
} from "vitest/config";

export default defineConfig({
  test: {
    environment: "edge-runtime",
    environmentMatchGlobs: [
      ["convex/**", "edge-runtime"],
      ["**", "jsdom"],
    ],
    server: { deps: { inline: ["convex-test"] } },
    exclude: [...configDefaults.exclude],
    coverage: {
      reporter: ["text", "json-summary"],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/*.config.?(c|m)[jt]s?(x)",
        "convex/_generated/**",
        "src/routeTree.gen.ts",
      ],
    },
  },
});
