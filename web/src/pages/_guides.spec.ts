import { expect, test } from "@playwright/test";

test.describe("guides", () => {
  test("shows embedded form document names", async ({ page }) => {
    await page.goto("/guides/ma/court-order");

    await expect(
      page
        .getByText(
          "This form helps you fill out name change documents, including:",
        )
        .first(),
    ).toBeVisible();
    await expect(
      page.getByText("Petition to Change Name of Adult (CJP-27)"),
    ).toBeVisible();
    await expect(
      page.getByText("Court Activity Record Request Form (CJP-34)"),
    ).toBeVisible();
  });
});
