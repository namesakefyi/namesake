import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Massachusetts birth certificate", async ({ page }, testInfo) => {
  // Minors require parental/guardian authorization, which is an extra step
  const birthYear = new Date().getFullYear() - 15;

  // Stub the location service so a single, known suggestion is returned.
  await page.route("**/api/location*", (route) =>
    route.fulfill({
      json: {
        results: [
          {
            place_id: "1",
            formatted: "100 Main St, Boston, MA 02108",
            address_line1: "100 Main St",
            housenumber: "100",
            street: "Main St",
            city: "Boston",
            state_code: "MA",
            postcode: "02108",
            county: "Suffolk",
          },
        ],
      },
    }),
  );

  await test.step("Title", async () => {
    await page.goto("/forms/birth-certificate-affidavit-ma");

    expect(page).toHaveTitle(/Birth Certificate: Massachusetts/);

    await expect(
      page.getByRole("heading", {
        name: "Birth Certificate: Massachusetts",
      }),
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
        "Use this form to update your legal name and gender marker on your Massachusetts birth certificate.",
      ),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Applicant Affidavit in Support of Amendment of a Birth Certificate for Sex (R-116)",
      ),
    ).toBeVisible();

    await expect(page.getByText("Responses are securely stored")).toBeVisible();

    await page.getByRole("button", { name: "Start" }).click();
  });

  await test.step("Old gender", async () => {
    await expect(
      page.getByRole("heading", {
        name: "Which gender marker appears on your birth certificate?",
      }),
    ).toBeVisible();
    await page.getByText("Female").click();
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("New gender", async () => {
    await expect(
      page.getByRole("heading", {
        name: "What is your new gender marker?",
      }),
    ).toBeVisible();
    await page.getByText("X").click();
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Old name", async () => {
    await expect(
      page.getByRole("heading", {
        name: "What is the name on your current birth certificate?",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "First name" }),
    ).toBeVisible();
    await page.getByRole("textbox", { name: "First name" }).fill("Marsha");
    await page.getByRole("textbox", { name: "Middle name" }).fill("P");
    await page.getByRole("textbox", { name: "Last name" }).fill("Johnson");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("New name", async () => {
    await expect(
      page.getByRole("heading", {
        name: "What is your new name?",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "First name" }),
    ).toBeVisible();
    await page.getByRole("textbox", { name: "First name" }).fill("Elliot");
    await page.getByRole("textbox", { name: "Middle name" }).fill("");
    await page
      .getByRole("textbox", { name: "Last or family name" })
      .fill("Page");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Date of birth", async () => {
    await expect(
      page.getByRole("heading", { name: "What is your date of birth?" }),
    ).toBeVisible();

    await page
      .getByRole("spinbutton", { name: "month, Date of birth" })
      .pressSequentially(`0101${birthYear}`);

    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Birth town", async () => {
    await expect(
      page.getByRole("heading", { name: "Where were you born?" }),
    ).toBeVisible();

    await page.getByRole("textbox", { name: "City/town" }).fill("Boston");

    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Parent full names", async () => {
    await expect(
      page.getByRole("heading", { name: "What are your parents’ names?" }),
    ).toBeVisible();

    await page
      .getByRole("textbox", { name: "Parent 1 full name" })
      .fill("Favorite parent");
    await page
      .getByRole("textbox", { name: "Parent 2 full name" })
      .fill("Second favorite parent");

    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Mailing address", async () => {
    await expect(
      page.getByRole("heading", { name: "What is your mailing address?" }),
    ).toBeVisible();

    await page.getByRole("searchbox", { name: "Street address" }).click();
    await page
      .getByRole("searchbox", { name: "Street address" })
      .fill("100 Main St");
    await page.getByRole("searchbox", { name: "Street address" }).press("Tab");
    await page.getByRole("textbox", { name: "City" }).fill("Boston");
    await page.getByRole("textbox", { name: "City" }).press("Tab");
    await page.getByRole("combobox", { name: "State" }).fill("ma");
    await page.getByRole("option", { name: "Massachusetts" }).click();
    await page.getByRole("textbox", { name: "ZIP" }).fill("02108");

    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Contact information", async () => {
    await expect(
      page.getByRole("heading", { name: "What is your contact information?" }),
    ).toBeVisible();

    await expect(
      page.getByRole("textbox", { name: "Phone number" }),
    ).toBeVisible();
    await page
      .getByRole("textbox", { name: "Phone number" })
      .fill("12345678901");

    await page
      .getByRole("textbox", { name: "Email address" })
      .fill("test@email.com");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Waive fees", async () => {
    await expect(
      page.getByRole("heading", {
        name: "Do you need to waive filing fees?",
      }),
    ).toBeVisible();

    await expect(page.getByRole("checkbox")).toBeVisible();

    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Guardian authorization", async () => {
    await expect(
      page.getByRole("heading", {
        name: "Parent or guardian authorization",
      }),
    ).toBeVisible();

    await expect(
      page.getByText(
        "Since you are under 18 years old, at least one parent or guardian must authorize this change.",
      ),
    ).toBeVisible();

    await page
      .getByRole("textbox", {
        name: "Parent or guardian 1’s full name",
      })
      .fill("Guardian numero uno");

    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Review information", async () => {
    await expect(
      page.getByRole("heading", { name: "Review your information" }),
    ).toBeVisible();

    await expect(page.getByText("Old first name: Marsha")).toBeVisible();
    await expect(page.getByText("Old middle name: P")).toBeVisible();
    await expect(page.getByText("Old last name: Johnson")).toBeVisible();

    await expect(
      page.getByText("Existing gender marker: Female"),
    ).toBeVisible();

    await expect(
      page.getByText(`Date of birth: January 1, ${birthYear}`),
    ).toBeVisible();

    await expect(page.getByText("City of birth: Boston")).toBeVisible();

    await expect(
      page.getByText("Parent 1 full name: Favorite parent"),
    ).toBeVisible();
    await expect(
      page.getByText("Parent 2 full name: Second favorite parent"),
    ).toBeVisible();

    await expect(page.getByText("New first name: Elliot")).toBeVisible();
    await expect(page.getByText("New middle name: Missing!")).toBeVisible();
    await expect(page.getByText("New last name: Page")).toBeVisible();

    await expect(page.getByText("Desired gender marker: X")).toBeVisible();

    await expect(
      page.getByText("Mailing street address: 100 Main St"),
    ).toBeVisible();
    await expect(
      page.getByText("Apartment, suite, unit, etc.: Missing!"),
    ).toBeVisible();
    await expect(page.getByText("Mailing city: Boston")).toBeVisible();
    await expect(page.getByText("Mailing state: MA")).toBeVisible();
    await expect(page.getByText("Mailing zip code: 02108")).toBeVisible();

    await expect(
      page.getByText("Phone number: +1 (234) 567-8901"),
    ).toBeVisible();
    await expect(page.getByText("Email: test@email.com")).toBeVisible();

    await expect(
      page.getByText("Guardian/parent 1’s full name: Guardian numero uno"),
    ).toBeVisible();
    await expect(
      page.getByText("Guardian/parent 2’s full name: Missing!"),
    ).toBeVisible();
  });

  await test.step("Finish, download, and complete", async () => {
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Finish and Download" }).click();
    const download = await downloadPromise;
    expect(download).toBeDefined();
    expect(download.suggestedFilename()).toBe(
      "Massachusetts Birth Certificate Affidavit.pdf",
    );

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
