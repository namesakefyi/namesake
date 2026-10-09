import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const request of [
  "My name",
  "My sex designation",
  "Both my name and sex designation",
]) {
  test(`New York Court Order: ${request}`, async ({ page }, testInfo) => {
    const nameChange = request !== "My sex designation";
    const sexChange = request !== "My name";
    if (nameChange && sexChange)
      await page.setViewportSize({ width: 390, height: 844 });

    // Keep address entry independent of the external location service.
    await page.route("**/api/location*", (route) =>
      route.fulfill({ json: { results: [] } }),
    );

    const next = async () => {
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      // The form moves focus on the next animation frame after navigation.
      await expect(
        page.locator(".form-step:focus, .form-review-step"),
      ).toBeVisible();
    };

    await test.step("Title", async () => {
      await page.goto("/forms/court-order-ny");
      await expect(page).toHaveTitle(/Court Order: New York/);
      await expect(
        page.getByRole("heading", { name: "Court Order: New York" }),
      ).toBeVisible();

      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      await testInfo.attach("accessibility-scan-results", {
        body: JSON.stringify(accessibilityScanResults, null, 2),
        contentType: "application/json",
      });
      expect(accessibilityScanResults.violations).toHaveLength(0);
      await expect(
        page.getByText("Responses are securely stored"),
      ).toBeVisible();
      await page.getByRole("button", { name: "Start", exact: true }).click();
      await expect(page.locator(".form-step")).toBeFocused();
    });

    await test.step("Requested court order", async () => {
      await page.getByText(request, { exact: true }).click();
      await next();
    });

    await test.step("Current legal name", async () => {
      await expect(
        page.getByRole("heading", { name: "What is your current legal name?" }),
      ).toBeVisible();
      if (nameChange) {
        await expect(
          page.getByText("This is the name you’re leaving behind.", {
            exact: false,
          }),
        ).toBeVisible();
      } else {
        await expect(
          page.getByText("Type it exactly as it appears on your ID.", {
            exact: true,
          }),
        ).toBeVisible();
      }
      await page
        .getByRole("textbox", { name: "First name", exact: true })
        .fill("Alex");
      await page
        .getByRole("textbox", { name: "Last or family name" })
        .fill("Example");
      await next();
    });

    if (nameChange) {
      await test.step("New name", async () => {
        await expect(
          page.getByRole("heading", { name: "What is your new name?" }),
        ).toBeVisible();
        await page
          .getByRole("textbox", { name: "First name", exact: true })
          .fill("Taylor");
        await next();
      });
    }

    await test.step("Date of birth", async () => {
      await expect(
        page.getByRole("heading", { name: "What is your date of birth?" }),
      ).toBeVisible();
      await page
        .getByRole("spinbutton", {
          name: "month, Date of birth",
          exact: true,
        })
        .pressSequentially("06");
      await page
        .getByRole("spinbutton", { name: "day, Date of birth", exact: true })
        .pressSequentially("15");
      await page
        .getByRole("spinbutton", { name: "year, Date of birth", exact: true })
        .pressSequentially("1990");
      await next();
    });

    await test.step("Residential address", async () => {
      await expect(
        page.getByRole("heading", { name: "What is your current address?" }),
      ).toBeVisible();
      await page
        .getByRole("searchbox", { name: "Street address", exact: true })
        .fill("123 Example Street");
      await page
        .getByRole("textbox", { name: "City", exact: true })
        .fill("Brooklyn");
      await page
        .getByRole("textbox", { name: "ZIP", exact: true })
        .fill("11201");
      await page
        .getByRole("button", { name: "Show suggestions State" })
        .click();
      await page.getByRole("option", { name: "New York", exact: true }).click();
      const county = page.getByRole("combobox", {
        name: "County",
        exact: true,
      });
      await county.click();
      await county.pressSequentially("Brooklyn");
      await page
        .getByRole("option", { name: "Kings (Brooklyn)", exact: true })
        .click();
      await expect(county).toHaveValue("Kings (Brooklyn)");
      await next();
    });

    await test.step("Court", async () => {
      await expect(
        page.getByRole("heading", { name: "Which court are you filing in?" }),
      ).toBeVisible();
      await page
        .getByRole("textbox", { name: "Court", exact: true })
        .fill("Supreme");
      await expect(
        page.getByRole("link", { name: "New York Courts court locator" }),
      ).toHaveAttribute("href", "https://www.nycourts.gov/court-locator");
      const county = page.getByRole("combobox", {
        name: "County",
        exact: true,
      });
      await county.click();
      await county.pressSequentially("Brooklyn");
      await page
        .getByRole("option", { name: "Kings (Brooklyn)", exact: true })
        .click();
      await expect(county).toHaveValue("Kings (Brooklyn)");
      await next();
    });

    if (nameChange) {
      await test.step("Birthplace", async () => {
        await expect(
          page.getByRole("heading", { name: "Where were you born?" }),
        ).toBeVisible();
        await next();
      });

      await test.step("Criminal convictions", async () => {
        await expect(
          page.getByRole("heading", {
            name: "Have you ever been convicted of a crime?",
          }),
        ).toBeVisible();
        await page.getByText("Yes", { exact: true }).click();
        await page
          .getByRole("textbox", { name: "Crime for which you were convicted" })
          .fill("Stale conviction details");
        await page.getByText("No", { exact: true }).click();
        await expect(
          page.getByRole("textbox", {
            name: "Crime for which you were convicted",
          }),
        ).toBeHidden();
        await next();
      });

      await test.step("Bankruptcy, judgments, and court cases", async () => {
        await expect(
          page.getByRole("heading", {
            name: "Do you have any bankruptcy filings, judgments, liens, or court cases?",
          }),
        ).toBeVisible();
        await next();
      });

      await test.step("Family situation", async () => {
        await expect(
          page.getByRole("heading", { name: "What is your family situation?" }),
        ).toBeVisible();
        await next();
      });

      await test.step("Child support", async () => {
        await expect(
          page.getByRole("heading", {
            name: "Do you have to pay child support?",
          }),
        ).toBeVisible();
        await next();
      });

      await test.step("Spousal support", async () => {
        await expect(
          page.getByRole("heading", {
            name: "Do you have to pay spousal support?",
          }),
        ).toBeVisible();
        await next();
      });

      await test.step("Previous name change", async () => {
        await expect(
          page.getByRole("heading", {
            name: "Have you ever filed a name change petition before?",
          }),
        ).toBeVisible();
        await next();
      });

      await test.step("Reason for name change", async () => {
        await expect(
          page.getByRole("heading", {
            name: "What are your reasons for changing your name?",
          }),
        ).toBeVisible();
        await expect(
          page.getByText("What do I write?", { exact: true }),
        ).toBeVisible();
        await page
          .getByRole("textbox", { name: "Reason for name change" })
          .fill("This is my name.");
        await next();
      });
    }

    if (sexChange) {
      await test.step("Sex designation", async () => {
        await expect(
          page.getByRole("heading", {
            name: "What is your new sex designation?",
          }),
        ).toBeVisible();
        await page
          .getByRole("textbox", { name: "New sex designation", exact: true })
          .fill("X");
        await page
          .getByRole("radiogroup", {
            name: "Would you like to include your reasons?",
          })
          .getByText("No", { exact: true })
          .click();
        await expect(
          page.getByRole("textbox", {
            name: "Reason for sex designation change",
          }),
        ).toBeHidden();
        await next();
      });
    }

    await test.step("Seal court record", async () => {
      await expect(
        page.getByRole("heading", {
          name: "Would you like the court record sealed for your personal safety?",
        }),
      ).toBeVisible();
      await expect(
        page.getByText(
          "The clerk will temporarily keep your name and case information private",
          { exact: false },
        ),
      ).toBeVisible();
      await page.getByText("Yes", { exact: true }).click();
      await expect(
        page.getByText("What do I write?", { exact: true }),
      ).toBeVisible();
      await page
        .getByRole("textbox", { name: "Reason to seal the court record" })
        .fill("For my personal safety.");
      await next();
    });

    await test.step("Supporting documents", async () => {
      await expect(
        page.getByRole("heading", {
          name: "Are you attaching supporting documents or additional pages?",
        }),
      ).toBeVisible();
      await page.getByText("No", { exact: true }).click();
      await next();
    });

    await test.step("Review your information", async () => {
      await expect(
        page.getByRole("heading", { name: "Review your information" }),
      ).toBeVisible();
      await expect(
        page.getByText("Old first name: Alex", { exact: true }),
      ).toBeVisible();
      await expect(page.getByText("Stale conviction details")).toBeHidden();
      await expect(
        page.getByRole("button", { name: "Finish and Download" }),
      ).toBeVisible();
      await expect(
        page.getByText("Residence county: Kings", { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText("Court county: Kings", { exact: true }),
      ).toBeVisible();
      // Reopening the draft resumes at review with saved answers.
      await page.reload();
      await expect(
        page.getByRole("heading", { name: "Review your information" }),
      ).toBeVisible();
      await expect(
        page.getByText("Old first name: Alex", { exact: true }),
      ).toBeVisible();
    });

    await test.step("Finish, download, and complete", async () => {
      const downloadPromise = page.waitForEvent("download");
      await page.getByRole("button", { name: "Finish and Download" }).click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe("New York Court Order.pdf");
      expect(await download.failure()).toBeNull();
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
}
