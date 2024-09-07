import type { Page, TestInfo } from "@playwright/test";

import AxeBuilder from "@axe-core/playwright";
import { test as baseTest, expect } from "@playwright/test";
import { createHtmlReport } from "axe-html-reporter";

const createMatcher = (testInfo: TestInfo) =>
  expect.extend({
    async toBeAccessible(page: Page) {
      const results = await new AxeBuilder({ page }).analyze();
      if (results.violations.length > 0) {
        await testInfo.attach("accessibilityReport.html", {
          body: createHtmlReport({ results }),
        });
      }

      return {
        message: () =>
          `Expected page ${
            this.isNot ? "not " : ""
          }to be accessible. See attached accessibiltyReport.html for details.`,
        pass: results.violations.length === 0,
      };
    },
  });

export const test = baseTest.extend<{
  expect: ReturnType<typeof createMatcher>;
}>({
  // biome-ignore lint/correctness/noEmptyPattern: Only one fixture
  expect: async ({}, use, testInfo) => {
    await use(createMatcher(testInfo));
  },
});
