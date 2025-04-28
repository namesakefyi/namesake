import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { createHtmlReport } from "axe-html-reporter";

test.describe("sign in", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should redirect to /signin", async ({ page }) => {
    await expect(page).toHaveURL("/signin");
  });

  test("should not have console errors", async ({ page }) => {
    const errors: Error[] = [];
    page.on("pageerror", (error) => {
      errors.push(error);
    });
    expect(errors).toHaveLength(0);
  });

  test("should pass accessibility tests", async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();

    createHtmlReport({ results });
    expect(results.violations).toHaveLength(0);
  });

  test("should have title", async ({ page }) => {
    await expect(page).toHaveTitle(/Namesake/);
  });

  test("should error on invalid sign in", async ({ page }) => {
    await page.getByRole("textbox", { name: "Email" }).fill("invalid@test.com");
    await page.getByRole("textbox", { name: "Password" }).fill("invalid");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("alert")).toHaveText(
      "Couldn't sign in. Check your information and try again.",
    );
  });
});

test.describe("register", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: "Register" }).click();
  });

  test("should link to terms in new tab", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "Terms of Service" }),
    ).toBeVisible();

    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "Terms of Service" }).click(),
    ]);

    await newPage.waitForLoadState();

    await expect(newPage).toHaveURL("https://namesake.fyi/terms/");
  });

  test("should link to privacy in new tab", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "Privacy Policy" }),
    ).toBeVisible();

    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "Privacy Policy" }).click(),
    ]);

    await newPage.waitForLoadState();

    await expect(newPage).toHaveURL("https://namesake.fyi/privacy/");
  });

  test("should block registration for weak passwords", async ({ page }) => {
    await page.getByRole("textbox", { name: "Email" }).fill("test@test.com");
    await page.getByRole("textbox", { name: "Password" }).fill("password");
    await expect(
      page.getByRole("meter", { name: "Password strength" }),
    ).toHaveAttribute("aria-valuenow", "0");
    await expect(page.getByTestId("password-strength-label")).toHaveText(
      "Weak!",
    );
    await page.getByRole("button", { name: "Register" }).click();
    await expect(page.getByRole("alert")).toHaveText(
      "Please choose a stronger password. This is a heavily used password.",
    );
  });

  test("should allow registration for strong passwords", async ({ page }) => {
    await page.getByRole("textbox", { name: "Email" }).fill("test@test.com");
    await page
      .getByRole("textbox", { name: "Password" })
      .fill("fgveA7GjhqHMEFN");
    await expect(
      page.getByRole("meter", { name: "Password strength" }),
    ).toHaveAttribute("aria-valuenow", "4");
    await expect(page.getByTestId("password-strength-label")).toHaveText(
      "Great",
    );
    await page.getByRole("button", { name: "Register" }).click();
    await expect(page).toHaveURL("/quests/court-order");
  });
});
