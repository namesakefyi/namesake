import { expect, test } from "@playwright/test";

test.describe("donate", () => {
  test("should redirect to Every.org donation page", async ({ page }) => {
    await page.goto("/donate");
    expect(page.url()).toContain("every.org");
  });
});
