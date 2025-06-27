import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { createHtmlReport } from "axe-html-reporter";

test.describe.configure({ mode: "parallel" });

test.describe("authentication pages", () => {
  test("should not have console errors on registration page", async ({
    page,
  }) => {
    const errors: Error[] = [];
    page.on("pageerror", (error) => {
      errors.push(error);
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(errors).toHaveLength(0);
  });

  test("should not have console errors on sign in page", async ({ page }) => {
    const errors: Error[] = [];
    page.on("pageerror", (error) => {
      errors.push(error);
    });

    await page.goto("/");
    await page.getByRole("tab", { name: "Sign in" }).click();
    await page.waitForLoadState("networkidle");
    expect(errors).toHaveLength(0);
  });
});

test.describe("registration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should pass automated accessibility tests", async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();

    createHtmlReport({ results });
    expect(results.violations).toHaveLength(0);
  });

  test("should default to registration tab on first visit", async ({
    page,
  }) => {
    await expect(page.getByRole("tab", { name: "Register" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByRole("tab", { name: "Sign in" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  [
    { name: "Terms of Service", url: "https://namesake.fyi/terms/" },
    { name: "Privacy Policy", url: "https://namesake.fyi/privacy/" },
  ].forEach(({ name, url }) => {
    test(`should link to ${name.toLowerCase()} in new tab`, async ({
      page,
    }) => {
      const [newPage] = await Promise.all([
        page.waitForEvent("popup"),
        page.getByRole("link", { name }).click(),
      ]);

      await newPage.waitForLoadState();
      await expect(newPage).toHaveURL(url);
    });
  });

  test("should validate password strength and registration flow", async ({
    page,
  }) => {
    await page.getByRole("textbox", { name: "Email" }).fill("test@test.com");
    await page.getByRole("textbox", { name: "Name" }).fill("test");

    // Test weak password
    await page.getByRole("textbox", { name: "Password" }).fill("password");
    await expect(
      page.getByRole("meter", { name: "Password strength" }),
    ).toHaveAttribute("aria-valuenow", "0");
    await expect(page.getByTestId("strength-label")).toHaveText("Weak!");
    await page.getByRole("button", { name: "Register" }).click();
    await expect(page.getByRole("alert")).toHaveText(
      "Please choose a stronger password. This is a heavily used password.",
    );

    // Test strong password and successful registration
    await page
      .getByRole("textbox", { name: "Password" })
      .fill("fgveA7GjhqHMEFN");
    await expect(
      page.getByRole("meter", { name: "Password strength" }),
    ).toHaveAttribute("aria-valuenow", "4");
    await expect(page.getByTestId("strength-label")).toHaveText("Great");
    await page.getByRole("button", { name: "Register" }).click();
    await page.waitForURL("/quests/getting-started");
  });
});

test.describe("sign in", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: "Sign in" }).click();
  });

  test("should have correct page setup", async ({ page }) => {
    await expect(page).toHaveURL("/signin");
    await expect(page).toHaveTitle(/Namesake/);
  });

  test("should validate form fields", async ({ page }) => {
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("textbox", { name: "Email" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(
      page.getByRole("textbox", { name: "Password" }),
    ).toHaveAttribute("aria-invalid", "true");

    await page.getByRole("textbox", { name: "Email" }).fill("invalid@test.com");
    await page.getByRole("textbox", { name: "Password" }).fill("invalid");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("alert")).toHaveText(
      "Invalid email or password",
    );
  });
});
