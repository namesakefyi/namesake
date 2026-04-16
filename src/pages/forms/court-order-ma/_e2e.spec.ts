import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Massachusetts Court Order", async ({ page }, testInfo) => {
  await test.step("Title", async () => {
    await page.goto("/forms/court-order-ma");

    expect(page).toHaveTitle(/Court Order: Massachusetts/);

    await expect(
      page.getByRole("heading", { name: "Court Order: Massachusetts" }),
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
      page.getByText(
        "This form helps you fill out name change documents, including:",
      ),
    ).toBeVisible();
    await expect(
      page.getByText("Petition to Change Name of Adult (CJP-27)"),
    ).toBeVisible();
    await expect(
      page.getByText("Court Activity Record Request Form (CJP-34)"),
    ).toBeVisible();
    await expect(page.getByText("Affidavit of Indigency")).toBeVisible();

    await expect(page.getByText("Responses are securely stored")).toBeVisible();

    await page.getByRole("button", { name: "Start" }).click();
  });

  await test.step("New name", async () => {
    await expect(
      page.getByRole("heading", { name: "What is your new name?" }),
    ).toBeVisible();
    await page.getByRole("textbox", { name: "First name" }).click();
    await page.getByRole("textbox", { name: "First name" }).fill("Marsha");

    await page.getByRole("textbox", { name: "Middle name" }).click();
    await page.getByRole("textbox", { name: "Middle name" }).fill("P");
    await page.getByRole("textbox", { name: "Last or family name" }).click();
    await page
      .getByRole("textbox", { name: "Last or family name" })
      .fill("Johnson");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Current legal name", async () => {
    await expect(
      page.getByRole("heading", { name: "What is your current legal name?" }),
    ).toBeVisible();
    await page.getByRole("textbox", { name: "First name" }).click();
    await page.getByRole("textbox", { name: "First name" }).fill("My");
    await page.getByRole("textbox", { name: "First name" }).press("Tab");
    await page.getByRole("textbox", { name: "Middle name" }).fill("Old");
    await page.getByRole("textbox", { name: "Middle name" }).press("Tab");
    await page
      .getByRole("textbox", { name: "Last or family name" })
      .fill("Name");

    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Reason for name change", async () => {
    await expect(
      page.getByRole("heading", {
        name: "What is the reason you’re changing your name?",
      }),
    ).toBeVisible();

    await page.getByRole("textbox", { name: "Reason for name change" }).click();
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
    await page.getByRole("textbox", { name: "Phone number" }).click();
    await page
      .getByRole("textbox", { name: "Phone number" })
      .fill("12345678901");

    await page.getByRole("textbox", { name: "Email address" }).click();
    await page
      .getByRole("textbox", { name: "Email address" })
      .fill("test@email.com");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Birthplace", async () => {
    await expect(
      page.getByRole("heading", { name: "Where were you born?" }),
    ).toBeVisible();
    await page.getByRole("textbox", { name: "City" }).click();
    await page.getByRole("textbox", { name: "City" }).fill("Birthcity");
    await page.getByRole("combobox", { name: "Country" }).click();
    await page.getByRole("combobox", { name: "Country" }).fill("unite");
    await page
      .getByRole("option", { name: "United States of America" })
      .click();
    await page.getByRole("combobox", { name: "State" }).click();
    await page.getByRole("combobox", { name: "State" }).fill("mas");
    await page.getByRole("option", { name: "Massachusetts" }).click();
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

  await test.step("Residential address", async () => {
    await expect(
      page.getByRole("heading", { name: "What is your residential address?" }),
    ).toBeVisible();
    await page.getByText("I am currently unhoused or").click();
    await expect(page.getByText("We recommend reaching out to")).toBeVisible();

    await page.getByText("I am currently unhoused or").click();
    await page.getByRole("textbox", { name: "Street address" }).click();
    await page
      .getByRole("textbox", { name: "Street address" })
      .fill("100 Main St");
    await page.getByRole("textbox", { name: "Street address" }).press("Tab");
    await page.getByRole("textbox", { name: "City" }).fill("Boston");
    await page.getByRole("textbox", { name: "City" }).press("Tab");
    await page.getByRole("combobox", { name: "State" }).fill("ma");
    await page.getByRole("option", { name: "Massachusetts" }).click();
    await page.getByRole("textbox", { name: "County" }).click();
    await page.getByRole("textbox", { name: "County" }).fill("Suffolk");
    await page.getByRole("textbox", { name: "ZIP" }).click();
    await page.getByRole("textbox", { name: "ZIP" }).fill("02108");

    await page.getByText("I use a different mailing address").click();
    await expect(
      page.getByRole("heading", { name: "What is your mailing address?" }),
    ).toBeVisible();
    await page.getByText("I use a different mailing").click();
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Previous name change", async () => {
    await expect(
      page.getByRole("heading", {
        name: "Have you ever changed your name before?",
      }),
    ).toBeVisible();
    await page.getByText("Yes, I’ve changed my name").click();
    await expect(
      page.getByRole("heading", { name: "Please list your past legal name." }),
    ).toBeVisible();
    await page.getByText("No, I’ve never changed my name").click();
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Other names", async () => {
    await expect(
      page.getByRole("heading", {
        name: "Have you ever used any other name or alias?",
      }),
    ).toBeVisible();
    await page.getByText("Yes, I’ve used other names").click();
    await expect(
      page.getByRole("heading", {
        name: "Please list all names you haven’t previously listed.",
      }),
    ).toBeVisible();
    await page
      .getByText("No, there are no other major names I’ve used")
      .click();
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Interpreter needed?", async () => {
    await expect(
      page.getByRole("heading", {
        name: "If there is a hearing for your name change, do you need an interpreter?",
      }),
    ).toBeVisible();

    await page.getByText("Yes, I need an interpreter").click();
    await expect(
      page.getByRole("combobox", { name: "Language" }),
    ).toBeVisible();
    await page.getByText("No, I don’t need an interpreter").click();

    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Pronouns", async () => {
    await expect(
      page.getByRole("heading", {
        name: "Do you want to share your pronouns with the court staff?",
      }),
    ).toBeVisible();
    await page.getByText("Yes").click();
    await page.getByRole("row", { name: "they/them" }).click();
    await page.getByRole("row", { name: "she/her" }).click();
    await page.getByRole("row", { name: "other pronouns" }).click();
    await page.getByRole("textbox", { name: "List other pronouns" }).click();
    await page
      .getByRole("textbox", { name: "List other pronouns" })
      .fill("zi/zir");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Return original documents", async () => {
    await expect(
      page.getByRole("heading", {
        name: "Do you want your original documents returned afterwards?",
      }),
    ).toBeVisible();
    await page.getByText("No, I don’t need my documents").click();
    await expect(
      page.getByText(
        "We strongly recommend getting your original documents back",
      ),
    ).toBeVisible();

    await page.getByText("Yes, return my documents").click();
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Fee waiver", async () => {
    await expect(
      page.getByRole("heading", {
        name: "Do you need to apply for a fee waiver?",
      }),
    ).toBeVisible();

    await expect(page.getByRole("cell", { name: "$165" })).toBeVisible();
    await page.getByText("Yes, help me waive filing fees").click();
    await expect(
      page.getByText("Your download will include an Affidavit of Indigency."),
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: "request financial assistance" }),
    ).toBeVisible();
    await page.getByText("No, I will pay the filing fee").click();
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Mother's maiden name", async () => {
    await expect(
      page.getByRole("heading", { name: "What is your mother’s maiden name?" }),
    ).toBeVisible();
    await page.getByRole("textbox", { name: "Mother’s maiden name" }).click();
    await page
      .getByRole("textbox", { name: "Mother’s maiden name" })
      .fill("Maiden");
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

    await expect(page.getByText("Currently unhoused? No")).toBeVisible();
    await expect(page.getByText("Residence street address: 100")).toBeVisible();
    await expect(page.getByText("Residence city: Boston")).toBeVisible();
    await expect(page.getByText("Residence county: Suffolk")).toBeVisible();
    await expect(page.getByText("Residence state: MA")).toBeVisible();
    await expect(
      page.getByText("Pronouns: they/them, she/her, other"),
    ).toBeVisible();

    await expect(page.getByText("Other pronouns: zi/zir")).toBeVisible();
    await expect(
      page.getByText("Return original documents? Yes"),
    ).toBeVisible();
  });

  await test.step("Finish, download, and complete", async () => {
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Finish and Download" }).click();
    const download = await downloadPromise;
    expect(download).toBeDefined();
    expect(download.suggestedFilename()).toBe("Massachusetts Court Order.pdf");

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
