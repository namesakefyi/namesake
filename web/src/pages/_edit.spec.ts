import { expect, test } from "@playwright/test";

test.describe("edit", () => {
  test("should redirect to GitHub Codespaces", async ({ page }) => {
    await page.goto("/edit");
    expect(page.url()).toContain("github.com");
  });
});
