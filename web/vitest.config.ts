import {
  configDefaults,
  coverageConfigDefaults,
  defineConfig,
} from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: [...configDefaults.exclude, "src/**/*.spec.ts"],
    setupFiles: ["./src/vitest.setup.ts"],
    environment: "jsdom",
    coverage: {
      reporter: ["text", "json-summary", "json"],
      reportOnFailure: true,
      include: [
        "src/components/**/*.{ts,tsx}",
        "src/content/pdfs/**/*.{ts,tsx}",
        "src/db/**/*.{ts,tsx}",
        "src/lib/**/*.{ts,tsx}",
      ],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/*.css",
        "**/*.pdf",
        "**/*.astro",
        "**/*.config.?(c|m)[jt]s?(x)",
        "**/*.stories.tsx",
        "src/components/**/index.ts",
        "src/content/pdfs/**/{index,schema}.ts",
      ],
      thresholds: {
        lines: 85,
        statements: 85,
        functions: 85,
        branches: 80,
      },
    },
  },
});
