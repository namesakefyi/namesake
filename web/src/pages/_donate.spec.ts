import { expect, test } from "@playwright/test";

test.describe("donate", () => {
  test("should redirect to Every.org donation page", async ({ page }) => {
    await page.goto("/donate");
    expect(page.url()).toContain("every.org");
  });

  test("should show suggested amounts in the homepage banner", async ({
    page,
  }) => {
    await page.goto("/");
    const banner = page.getByRole("region", {
      name: "Keep Namesake free for everyone",
    });

    for (const amount of ["$10", "$25", "$50", "$100"]) {
      await expect(
        banner.getByRole("link", { name: amount, exact: true }),
      ).toHaveAttribute("href", /every\.org\/namesake/);
    }
  });

  test("should prefill monthly donations when toggled", async ({ page }) => {
    await page.goto("/");
    await page.locator("label", { hasText: "Monthly" }).click();
    await expect(page.getByRole("radio", { name: "Monthly" })).toBeChecked();

    await expect(
      page.getByRole("link", { name: "$25", exact: true }),
    ).toHaveAttribute("href", /amount=25&frequency=monthly/);
  });

  test("should open the donation popup from the header", async ({ page }) => {
    await page.goto("/guides");
    await page
      .getByRole("navigation", { name: "Site" })
      .getByRole("link", { name: "Donate" })
      .click();

    await expect(page.locator("#every-shadow-wrapper")).toBeAttached();
    expect(page.url()).not.toContain("every.org");
  });

  test("should fall back to Every.org if the popup fails to load", async ({
    page,
  }) => {
    await page.route("**/embeds.every.org/**", (route) => route.abort());
    await page.goto("/");
    await page.getByRole("link", { name: "$25", exact: true }).click();

    await page.waitForURL(/every\.org/);
  });
});
