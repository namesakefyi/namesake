import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages: Record<string, string> = {
  "/": "Your name is yours to change",
  "/404": "Page Not Found",
  "/blog": "Blog",
  "/brand-assets": "Brand Assets",
  "/directory": "Directory",
  "/forms": "Forms",
  "/guides": "Guides",
  "/press": "Press",
  "/privacy": "Privacy",
  "/terms": "Terms",
};

test.describe("accessibility", () => {
  for (const [path, title] of Object.entries(pages)) {
    test(`${path} has no accessibility violations`, async ({
      page,
    }, testInfo) => {
      await page.goto(path);

      await expect(page).toHaveTitle(new RegExp(title));

      const accessibilityScanResults = await new AxeBuilder({
        page,
      }).analyze();

      await testInfo.attach("accessibility-scan-results", {
        body: JSON.stringify(accessibilityScanResults, null, 2),
        contentType: "application/json",
      });

      expect(accessibilityScanResults.violations).toHaveLength(0);
    });
  }
});
