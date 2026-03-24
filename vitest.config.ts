/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";
import { configDefaults, coverageConfigDefaults } from "vitest/config";

export default getViteConfig({
  test: {
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: [...configDefaults.exclude, "e2e/**"],
    setupFiles: ["./src/vitest.setup.ts"],
    environment: "jsdom",
    coverage: {
      reporter: ["text", "json-summary", "json"],
      reportOnFailure: true,
      include: [
        "src/components/**/*.{ts,tsx}",
        "src/db/**/*.{ts,tsx}",
        "src/forms/**/*.ts",
        "src/pdfs/**/*.{ts,tsx}",
        "src/utils/**/*.{ts,tsx}",
      ],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/*.css",
        "**/*.pdf",
        "**/*.astro",
        "**/*.config.?(c|m)[jt]s?(x)",
        "**/*.stories.tsx",
        "src/components/**/index.ts",
        "src/pdfs/index.ts",
        "src/pdfs/**/schema.ts",
      ],
      thresholds: {
        lines: 85,
        statements: 85,
        functions: 85,
        branches: 85,
      },
    },
  },
});
