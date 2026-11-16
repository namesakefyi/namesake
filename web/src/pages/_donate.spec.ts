import { expect, test } from "@playwright/test";

test.describe("donate", () => {
  test("should redirect to Every.org with the amount and frequency", async ({
    request,
  }) => {
    const response = await request.get("/donate?amount=25&frequency=monthly", {
      maxRedirects: 0,
    });

    expect(response.status()).toBe(308);
    expect(response.headers().location).toMatch(
      /^https:\/\/www\.every\.org\/namesake\?.*amount=25&frequency=monthly/,
    );
  });

  test("should prefill monthly donations when toggled", async ({ page }) => {
    await page.goto("/");
    await page.locator("label", { hasText: "Monthly" }).click();

    await expect(
      page.getByRole("link", { name: "$25", exact: true }),
    ).toHaveAttribute("href", "/donate?amount=25&frequency=monthly");
  });

  test("should open the donation popover from donate links", async ({
    page,
  }) => {
    await page.route("**/embeds.every.org/**", (route) =>
      route.fulfill({
        contentType: "text/javascript",
        body: `window.everyDotOrgDonateButton = {
          createWidget() {},
          setOptions() {},
          showWidget() { document.body.dataset.donateOpened = "true"; },
        };`,
      }),
    );
    await page.goto("/guides");
    await page
      .getByRole("navigation", { name: "Site" })
      .getByRole("link", { name: "Donate" })
      .click();

    await expect(page.locator("body")).toHaveAttribute(
      "data-donate-opened",
      "true",
    );
    expect(page.url()).not.toContain("every.org");
  });

  test("should fall back to Every.org if the popover fails to load", async ({
    page,
  }) => {
    await page.route("**/embeds.every.org/**", (route) => route.abort());
    await page.route("https://www.every.org/**", (route) => route.abort());
    await page.goto("/");

    const everyOrgRequest = page.waitForRequest(/www\.every\.org\/namesake/);
    await page.getByRole("link", { name: "$25", exact: true }).click();
    expect((await everyOrgRequest).url()).toContain("amount=25");
  });
});
