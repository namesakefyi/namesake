import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Massachusetts State ID", async ({ page }, testInfo) => {
  // The full workflow includes guide rendering, accessibility checks, and a PDF download.
  test.setTimeout(60_000);

  await page.goto("/guides/ma/state-id");
  await expect(
    page.getByRole("heading", { name: "Fill out forms" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "State ID: Massachusetts" }),
  ).toBeVisible();
  await expect(
    page.getByText("Driver's license/ID amendment fee"),
  ).toBeVisible();

  await page.goto("/forms/state-id-ma");

  expect(page).toHaveTitle(/State ID: Massachusetts/);
  await expect(
    page.getByRole("heading", { name: "State ID: Massachusetts" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Driver's License, Learner's Permit, or ID Card Application (LIC100)",
    ),
  ).toBeVisible();
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  await testInfo.attach("accessibility-scan-results", {
    body: JSON.stringify(accessibilityScanResults, null, 2),
    contentType: "application/json",
  });
  expect(accessibilityScanResults.violations).toHaveLength(0);

  await page.getByRole("button", { name: "Start" }).click();

  await expect(
    page.getByText(
      "A Massachusetts REAL ID has a star in the top-right corner.",
    ),
  ).toBeVisible();
  await page.getByText("Standard ID", { exact: true }).click();
  await expect(
    page.getByText(
      "A Standard ID does not have a star and is not acceptable as federal identification.",
    ),
  ).toBeVisible();
  await page.getByText("Driver's license", { exact: true }).click();
  await page.getByText("Passenger (Class D)", { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("textbox", { name: "First name" }).fill("Marsha");
  await page.getByRole("textbox", { name: "Middle name" }).fill("P");
  await page
    .getByRole("textbox", { name: "Last or family name" })
    .fill("Johnson");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("textbox", { name: "First name" }).fill("Old");
  await page.getByRole("textbox", { name: "Middle name" }).fill("M");
  await page.getByRole("textbox", { name: "Last or family name" }).fill("Name");
  await page
    .getByRole("textbox", { name: "Current Massachusetts credential number" })
    .fill("S12345678");
  await page.getByRole("button", { name: "Continue" }).click();

  await page
    .getByRole("spinbutton", { name: "month, Date of birth" })
    .pressSequentially("01011990");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByText("Gender marker", { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await page
    .getByText("I am currently unhoused or without permanent housing")
    .click();
  await expect(
    page.getByText(
      "If you are staying at a shelter or hospital, enter the facility's address below.",
      { exact: false },
    ),
  ).toBeVisible();
  await page
    .getByRole("searchbox", { name: "Street address" })
    .fill("123 Main St");
  await page.getByRole("textbox", { name: "City" }).fill("Boston");
  const stateCombobox = page.getByRole("combobox", { name: "State" });
  await stateCombobox.click();
  await stateCombobox.fill("mass");
  await stateCombobox.press("ArrowDown");
  await stateCombobox.press("Enter");
  await expect(stateCombobox).toHaveValue("Massachusetts");
  await page.getByRole("textbox", { name: "ZIP" }).fill("02108");
  await page.getByRole("button", { name: "Continue" }).click();

  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("test@example.com");
  await page.getByRole("textbox", { name: "Phone number" }).fill("6175550123");
  await page.getByText("Cell", { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByText("No", { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(
    page.getByText("Nonbinary, gender-fluid, or gender-nonconforming people"),
  ).toBeVisible();
  await expect(
    page.getByText("Intersex people", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Massachusetts does not require medical proof or documentation to choose or switch to an X designation on a driver's license or state ID.",
    ),
  ).toBeVisible();
  // Leave gender and eye color unanswered to cover optional radio values in the PDF.
  await page.getByRole("textbox", { name: "Feet" }).fill("5");
  await page.getByRole("textbox", { name: "Inches" }).fill("8");
  await page
    .getByRole("radiogroup", {
      name: "Register me, or keep me registered, as an organ and tissue donor",
    })
    .getByText("Yes", { exact: true })
    .click();
  await expect(
    page.getByText(
      "If you are already registered as an organ and tissue donor, select Yes to remain registered.",
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByText("Yes", { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(
    page.getByText(
      "An out-of-state driver's license or ID card may be canceled when your Massachusetts driver's license or ID card is issued.",
    ),
  ).toBeVisible();
  await page.getByText("No", { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  for (const question of [
    "Do you have a cognitive, neurologic, physical, or other impairment that may affect your ability to operate a motor vehicle safely?",
    "Are you taking any medication that may affect your ability to safely operate a motor vehicle?",
    "Is your license or right to operate suspended, revoked, canceled, withdrawn, or disqualified here or in another jurisdiction?",
  ]) {
    await page
      .getByRole("radiogroup", { name: question })
      .getByText("No", { exact: true })
      .click();
  }
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(
    page.getByRole("heading", { name: "Review your information" }),
  ).toBeVisible();
  await expect(page.getByText("New last name: Johnson")).toBeVisible();
  await expect(page.getByText("Currently unhoused? Yes")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Finish and Download" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe(
    "Massachusetts State ID Application.pdf",
  );
  const downloadPath = await download.path();
  expect(downloadPath).not.toBeNull();
  if (downloadPath) {
    await testInfo.attach("filled-state-id-application", {
      path: downloadPath,
      contentType: "application/pdf",
    });
  }
  await expect(
    page.getByRole("heading", { name: "Form complete!" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Remember to print, sign, and date your application. The application is not complete without your signature.",
    ),
  ).toBeVisible();
});
