import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Rhode Island Court Order", async ({ page }, testInfo) => {
  await test.step("Title", async () => {
    await page.goto("/forms/court-order-ri");

    expect(page).toHaveTitle(/Court Order: Rhode Island/);

    await expect(
      page.getByRole("heading", { name: "Court Order: Rhode Island" }),
    ).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({
      page,
    }).analyze();

    await testInfo.attach("accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: "application/json",
    });

    expect(accessibilityScanResults.violations).toHaveLength(0);

    await expect(
      page.getByText("Change of Name (PC-8.1)"),
    ).toBeVisible();

    await expect(page.getByText("Responses are securely stored")).toBeVisible();

    await page.getByRole("button", { name: "Start" }).click();
  });

  await test.step("New name", async () => {
    await expect(
      page.getByRole("heading", { name: "What is your new name?" }),
    ).toBeVisible();
    await page.getByRole("textbox", { name: "First name" }).fill("Marsha");
    await page.getByRole("textbox", { name: "Middle name" }).fill("P");
    await page.getByRole("textbox", { name: "Last or family name" }).fill("Johnson");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Current legal name", async () => {
    await expect(
      page.getByRole("heading", { name: "What is your current legal name?" }),
    ).toBeVisible();
    await page.getByRole("textbox", { name: "First name" }).fill("My");
    await page.getByRole("textbox", { name: "Middle name" }).fill("Old");
    await page.getByRole("textbox", { name: "Last or family name" }).fill("Name");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Reason for name change", async () => {
    await expect(
      page.getByRole("heading", {
        name: "What is the reason you're changing your name?",
      }),
    ).toBeVisible();
    await expect(page.getByText("What do I write?")).toBeVisible();
    await page
      .getByRole("textbox", { name: "Reason for name change" })
      .fill("I want a name which aligns with my gender identity.");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Contact information", async () => {
    await expect(
      page.getByRole("heading", { name: "What is your contact information?" }),
    ).toBeVisible();
    await page.getByRole("textbox", { name: "Phone number" }).fill("12345678901");
    await page.getByRole("textbox", { name: "Email address" }).fill("test@email.com");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Residential address", async () => {
    await expect(
      page.getByRole("heading", { name: "What is your residential address?" }),
    ).toBeVisible();
    await page.getByRole("textbox", { name: "Street address" }).fill("100 Main St");
    await page.getByRole("textbox", { name: "City" }).fill("Providence");
    await page.getByRole("combobox", { name: "State" }).fill("ri");
    await page.getByRole("option", { name: "Rhode Island" }).click();
    await page.getByRole("textbox", { name: "ZIP" }).fill("02903");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Previous addresses", async () => {
    await expect(
      page.getByRole("heading", {
        name: "What are all the addresses where you've lived?",
      }),
    ).toBeVisible();
    await page
      .getByRole("textbox", { name: "Previous addresses" })
      .fill("100 Main St, Providence, RI 02903\n45 Oak Ave, Cranston, RI 02910");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Date of birth", async () => {
    await expect(
      page.getByRole("heading", { name: "What is your date of birth?" }),
    ).toBeVisible();
    await page
      .getByRole("spinbutton", { name: "month, Date of birth" })
      .pressSequentially("01011970");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Birthplace", async () => {
    await expect(
      page.getByRole("heading", { name: "Where were you born?" }),
    ).toBeVisible();
    await page.getByRole("textbox", { name: "City" }).fill("Providence");
    await page.getByRole("combobox", { name: "Country" }).fill("unite");
    await page.getByRole("option", { name: "United States of America" }).click();
    await page.getByRole("combobox", { name: "State" }).fill("rho");
    await page.getByRole("option", { name: "Rhode Island" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Birth certificate", async () => {
    await expect(
      page.getByRole("heading", { name: "Were you born in Rhode Island?" }),
    ).toBeVisible();
    await page.getByText("Yes, I was born in Rhode Island").click();
    await expect(
      page.getByRole("heading", {
        name: "Do you also want to update your birth certificate?",
      }),
    ).toBeVisible();
    await page
      .getByText("Yes, update my birth certificate to my new name")
      .click();
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Previous name change", async () => {
    await expect(
      page.getByRole("heading", {
        name: "Have you ever changed your name before?",
      }),
    ).toBeVisible();
    await page.getByText("No, I've never changed my name").click();
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Family information", async () => {
    await expect(
      page.getByRole("heading", { name: "What are your parents' names?" }),
    ).toBeVisible();
    await page.getByRole("textbox", { name: "Mother's maiden name" }).fill("Maiden");
    await page.getByRole("textbox", { name: "Father's name" }).fill("Father Name");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Personal information", async () => {
    await expect(
      page.getByRole("heading", { name: "Tell us a bit about yourself." }),
    ).toBeVisible();
    await page.getByRole("textbox", { name: "Occupation" }).fill("Software Engineer");
    await page.getByRole("textbox", { name: "Marital status (optional)" }).fill("Single");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Review your information", async () => {
    await expect(
      page.getByRole("heading", { name: "Review your information" }),
    ).toBeVisible();
    await expect(page.getByText("New last name: Johnson")).toBeVisible();
    await expect(
      page.getByText(
        "Reason for changing name: I want a name which aligns with my gender identity.",
      ),
    ).toBeVisible();
    await expect(
      page.getByText("Phone number: +1 (234) 567-8901"),
    ).toBeVisible();
    await expect(page.getByText("Email: test@email.com")).toBeVisible();
    await expect(
      page.getByText("Date of birth: January 1, 1970"),
    ).toBeVisible();
    await expect(
      page.getByText("Residence street address: 100"),
    ).toBeVisible();
    await expect(page.getByText("Residence city: Providence")).toBeVisible();
    await expect(page.getByText("Mother's maiden name: Maiden")).toBeVisible();
    await expect(page.getByText("Father's name: Father Name")).toBeVisible();
    await expect(page.getByText("Occupation: Software Engineer")).toBeVisible();
  });

  await test.step("Finish, download, and complete", async () => {
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Finish and Download" }).click();
    const download = await downloadPromise;
    expect(download).toBeDefined();
    expect(download.suggestedFilename()).toBe("Rhode Island Court Order.pdf");

    await expect(
      page.getByRole("heading", { name: "Form complete!" }),
    ).toBeVisible();
    await expect(page.getByText("Check your downloads")).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Help improve this form" }),
    ).toBeVisible();

    await expect(
      page.getByText(/There are \d+ responses stored on this browser/),
    ).toBeVisible();
  });
});
