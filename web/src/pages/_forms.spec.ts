import { expect, test } from "@playwright/test";

test.describe("forms", () => {
  test("shows the status of a started form", async ({ page }) => {
    await page.goto("/forms");
    const courtOrder = page
      .getByRole("article")
      .filter({ has: page.locator('a[href="/forms/ma/court-order"]') })
      .locator(".form-status");
    await expect(courtOrder).toHaveAttribute("data-status", "not-started");
    await expect(courtOrder).not.toHaveAttribute("data-loading");

    await page.goto("/forms/ma/court-order");
    await page.getByRole("button", { name: "Start" }).click();
    await expect(page.getByRole("button", { name: "Start" })).toBeHidden();

    await page.goto("/forms");
    await expect(courtOrder).toHaveAttribute("data-status", "in-progress");
    await expect(courtOrder.getByText("In progress")).toBeVisible();

    const socialSecurity = page
      .getByRole("article")
      .filter({ has: page.locator('a[href="/forms/social-security"]') })
      .locator(".form-status");
    await expect(socialSecurity).toHaveAttribute("data-status", "not-started");
  });
});
