import { expect, type Page, test } from "@playwright/test";

const frequencyInputs = (page: Page) =>
  page.locator('input[name="donation-frequency"]');

const firstAmountLink = (page: Page) =>
  page.locator(".amounts").getByRole("link").first();

const withFrequency = (frequency: string) =>
  new RegExp(`^/donate\\?amount=\\d+&frequency=${frequency}$`);

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

  test("should prefill the checked frequency by default", async ({ page }) => {
    await page.goto("/");
    const frequency = await frequencyInputs(page)
      .and(page.locator(":checked"))
      .inputValue();

    await expect(firstAmountLink(page)).toHaveAttribute(
      "href",
      withFrequency(frequency),
    );
  });

  test("should prefill the frequency when toggled", async ({ page }) => {
    await page.goto("/");

    for (const input of await frequencyInputs(page).all()) {
      const frequency = await input.inputValue();
      await input.locator("..").click();

      await expect(firstAmountLink(page)).toHaveAttribute(
        "href",
        withFrequency(frequency),
      );
    }
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
    const amountLink = firstAmountLink(page);
    const amount = new URL(
      (await amountLink.getAttribute("href")) ?? "",
      page.url(),
    ).searchParams.get("amount");
    await amountLink.click();
    expect((await everyOrgRequest).url()).toContain(`amount=${amount}`);
  });
});
