import { expect, test } from "@playwright/test";

test.describe("chat", () => {
  test("should redirect to Discord invite", async ({ page }) => {
    await page.goto("/chat");
    expect(page.url()).toContain("discord.com");
  });
});
