import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Social Security", async ({ page }, testInfo) => {
  await test.step("Title", async () => {
    await page.goto("/forms/social-security");

    await expect(page).toHaveTitle(/Social Security/);

    await expect(
      page.getByRole("heading", { name: "Social Security" }),
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
      page.getByText("Application for Social Security Card (SS-5)"),
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
    await page
      .getByRole("textbox", { name: "Last or family name" })
      .fill("Johnson");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Name at birth", async () => {
    await expect(
      page.getByRole("heading", { name: "What was your name at birth?" }),
    ).toBeVisible();
    await page.getByRole("textbox", { name: "First name" }).fill("My");
    await page.getByRole("textbox", { name: "Middle name" }).fill("Old");
    await page
      .getByRole("textbox", { name: "Last or family name" })
      .fill("Name");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Other legal names (conditional text)", async () => {
    await expect(
      page.getByRole("heading", {
        name: "Have you used any other legal names?",
      }),
    ).toBeVisible();

    await page.getByText("Yes").click();
    await expect(
      page.getByRole("textbox", { name: "Other names used" }),
    ).toBeVisible();
    await page
      .getByRole("textbox", { name: "Other names used" })
      .fill("Jane Marie Smith");

    await page.getByText("No, I’ve never changed my name before").click();

    await expect(
      page.getByRole("textbox", { name: "Other names used" }),
    ).toHaveCount(0);

    await page.getByText("Yes").click();
    await page
      .getByRole("textbox", { name: "Other names used" })
      .fill("Jane Marie Smith");

    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Birthplace (conditional state when US)", async () => {
    await expect(
      page.getByRole("heading", { name: "Where were you born?" }),
    ).toBeVisible();

    await page
      .getByRole("textbox", { name: "City of birth" })
      .fill("Springfield");
    await page.getByRole("combobox", { name: "Country" }).click();
    await page.getByRole("combobox", { name: "Country" }).fill("can");
    await page.getByRole("option", { name: "Canada" }).click();
    await expect(page.getByRole("combobox", { name: "State" })).toHaveCount(0);

    await page.getByRole("combobox", { name: "Country" }).click();
    await page.getByRole("combobox", { name: "Country" }).fill("unite");
    await page
      .getByRole("option", { name: "United States of America" })
      .click();
    await expect(page.getByRole("combobox", { name: "State" })).toBeVisible();
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

  await test.step("Citizenship (conditional warning banner)", async () => {
    await expect(
      page.getByRole("heading", { name: "What is your citizenship status?" }),
    ).toBeVisible();

    await page.getByText("Legal Alien Not Allowed To Work").click();
    await expect(
      page.getByText(
        "You must provide a document from a U.S. Federal, State, or local government agency",
      ),
    ).toBeVisible();

    await page.getByText("Other").click();
    await expect(
      page.getByText(
        "You must provide a document from a U.S. Federal, State, or local government agency",
      ),
    ).toBeVisible();

    await page.getByText("U.S. Citizen").click();
    await expect(
      page.getByText(
        "You must provide a document from a U.S. Federal, State, or local government agency",
      ),
    ).toHaveCount(0);

    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Ethnicity", async () => {
    await expect(
      page.getByRole("heading", { name: "What is your ethnicity?" }),
    ).toBeVisible();

    await page.getByText("Prefer not to answer").click();
    await page.getByText("I am not Hispanic or Latino").click();

    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Race", async () => {
    await expect(
      page.getByRole("heading", { name: "What is your race?" }),
    ).toBeVisible();

    await page.getByText("Asian").click();
    await page.getByText("Black or African American").click();

    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Sex", async () => {
    await expect(
      page.getByRole("heading", { name: "What is your sex?" }),
    ).toBeVisible();

    await expect(
      page.getByText("Namesake recommends selecting the same gender marker"),
    ).toBeVisible();

    await page.getByText("Female", { exact: true }).click();
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Mother's name", async () => {
    await expect(
      page.getByRole("heading", {
        name: "What is your mother’s (or first parent’s) name?",
      }),
    ).toBeVisible();
    await page.getByRole("textbox", { name: "First name" }).fill("Mary");
    await page.getByRole("textbox", { name: "Middle name" }).fill("Q");
    await page
      .getByRole("textbox", { name: "Last or family name" })
      .fill("Maiden");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Father's name", async () => {
    await expect(
      page.getByRole("heading", {
        name: "What is your father’s (or second parent’s) name?",
      }),
    ).toBeVisible();
    await page.getByRole("textbox", { name: "First name" }).fill("John");
    await page.getByRole("textbox", { name: "Middle name" }).fill("F");
    await page
      .getByRole("textbox", { name: "Last or family name" })
      .fill("Father");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Previous Social Security card (conditional name fields)", async () => {
    await expect(
      page.getByRole("heading", {
        name: "Do you have a previous Social Security card?",
      }),
    ).toBeVisible();

    await page
      .getByText(
        "Yes, I have a previous Social Security card or have applied for one",
      )
      .click();
    await expect(
      page.getByRole("heading", {
        name: "What is the name shown on your most recent Social Security card?",
      }),
    ).toBeVisible();

    await page.getByRole("textbox", { name: "First name" }).fill("Alice");
    await page.getByRole("textbox", { name: "Middle name" }).fill("B");
    await page
      .getByRole("textbox", { name: "Last or family name" })
      .fill("Carter");

    await page
      .getByText(
        "No, I have never filed for or received a Social Security card before",
      )
      .click();
    await expect(
      page.getByRole("heading", {
        name: "What is the name shown on your most recent Social Security card?",
      }),
    ).toHaveCount(0);

    await page
      .getByText(
        "Yes, I have a previous Social Security card or have applied for one",
      )
      .click();
    await page.getByRole("textbox", { name: "First name" }).fill("Alice");
    await page.getByRole("textbox", { name: "Middle name" }).fill("B");
    await page
      .getByRole("textbox", { name: "Last or family name" })
      .fill("Carter");

    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Phone number", async () => {
    await expect(
      page.getByRole("heading", { name: "What is your phone number?" }),
    ).toBeVisible();
    await page
      .getByRole("textbox", { name: "Phone number" })
      .fill("12345678901");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Mailing address", async () => {
    await expect(
      page.getByRole("heading", { name: "What is your mailing address?" }),
    ).toBeVisible();
    await page
      .getByRole("textbox", { name: "Street address" })
      .fill("200 Oak St");
    await page.getByRole("textbox", { name: "City" }).fill("Boston");
    await page.getByRole("combobox", { name: "State" }).click();
    await page.getByRole("combobox", { name: "State" }).fill("ma");
    await page.getByRole("option", { name: "Massachusetts" }).click();
    await page.getByRole("textbox", { name: "ZIP" }).fill("02110");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Filing for someone else (conditional relationship fields)", async () => {
    await expect(
      page.getByRole("heading", {
        name: "Are you filing this form for someone else?",
      }),
    ).toBeVisible();

    await page.getByText("Yes, I am filing this for someone else").click();
    await expect(
      page.getByRole("heading", {
        name: "What is your relationship to the person you are filing for?",
      }),
    ).toBeVisible();

    await page.getByText("Natural or Adoptive Parent").click();
    await expect(
      page.getByRole("textbox", { name: "Specify relationship" }),
    ).toHaveCount(0);

    await page.getByText("Other").click();
    await expect(
      page.getByRole("textbox", { name: "Specify relationship" }),
    ).toBeVisible();
    await page
      .getByRole("textbox", { name: "Specify relationship" })
      .fill("Court-appointed guardian");

    await page.getByText("No, I am filing this for myself").click();
    await expect(
      page.getByRole("heading", {
        name: "What is your relationship to the person you are filing for?",
      }),
    ).toHaveCount(0);

    await page.getByText("Yes, I am filing this for someone else").click();
    await page.getByText("Other").click();
    await page
      .getByRole("textbox", { name: "Specify relationship" })
      .fill("Court-appointed guardian");

    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Review your information", async () => {
    await expect(
      page.getByRole("heading", { name: "Review your information" }),
    ).toBeVisible();

    await expect(page.getByText("New last name: Johnson")).toBeVisible();
    await expect(page.getByText("Old last name: Name")).toBeVisible();
    await expect(
      page.getByText("Previous legal names: Jane Marie Smith"),
    ).toBeVisible();
    await expect(page.getByText("Citizenship status: usCitizen")).toBeVisible();
    await expect(page.getByText("Hispanic or Latino? No")).toBeVisible();
    await expect(page.getByText("Race: asian, black")).toBeVisible();
    await expect(page.getByText("Sex assigned at birth: female")).toBeVisible();
    await expect(page.getByText("Mother’s last name: Maiden")).toBeVisible();
    await expect(page.getByText("Father’s last name: Father")).toBeVisible();
    await expect(
      page.getByText("Previous Social Security card? Yes"),
    ).toBeVisible();
    await expect(
      page.getByText("Last name on previous Social Security card: Carter"),
    ).toBeVisible();
    await expect(
      page.getByText("Are you filing this form for someone else? Yes"),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Relationship to the person you are filing for (other): Court-appointed guardian",
      ),
    ).toBeVisible();
  });

  await test.step("Finish, download, and complete", async () => {
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Finish and Download" }).click();
    const download = await downloadPromise;
    expect(download).toBeDefined();
    expect(download.suggestedFilename()).toBe("Social Security Card.pdf");

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
