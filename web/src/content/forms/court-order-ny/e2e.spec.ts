import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const request of [
  "My name",
  "My sex designation",
  "Both my name and sex designation",
]) {
  test(`NY draft: ${request}`, async ({ page }, testInfo) => {
    const nameChange = request !== "My sex designation";
    const sexChange = request !== "My name";
    if (nameChange && sexChange)
      await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/forms/court-order-ny");
    await expect(
      page.getByRole("heading", { name: "Court Order: New York" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Start", exact: true }).click();
    await page.getByText(request, { exact: true }).click();
    const next = () =>
      page.getByRole("button", { name: "Continue", exact: true }).click();
    await next();
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
    if (nameChange) {
      await expect(
        page.getByRole("heading", { name: "What is your new name?" }),
      ).toBeVisible();
      await page
        .getByRole("textbox", { name: "First name", exact: true })
        .fill("Taylor");
      await next();
    }
    for (const heading of [
      "What is your date of birth?",
      "What is your current address?",
      "Which court are you filing in?",
    ]) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
      if (heading !== "What is your date of birth?") {
        const county = page.getByRole("combobox", {
          name: "County",
          exact: true,
        });
        await county.fill("Westch");
        await page
          .getByRole("option", { name: "Westchester", exact: true })
          .click();
        await expect(county).toHaveValue("Westchester");
        await page.reload();
        await expect(county).toHaveValue("Westchester");
        await county.clear();
        await county.press("ArrowDown");
        await expect(page.getByRole("option")).toHaveCount(62);
        await page.screenshot({
          path: testInfo.outputPath(
            heading.startsWith("Which")
              ? "court-counties.png"
              : "residence-counties.png",
          ),
          fullPage: true,
        });
        await page
          .getByRole("option", { name: "Kings (Brooklyn)", exact: true })
          .click();
      }
      await next();
    }
    if (nameChange) {
      await expect(
        page.getByRole("heading", { name: "Where were you born?" }),
      ).toBeVisible();
      await next();
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
      for (const heading of [
        "Do you have any bankruptcy filings, judgments, liens, or court cases?",
        "What is your family situation?",
        "Do you have to pay child support?",
        "Do you have to pay spousal support?",
        "Have you ever filed a name change petition before?",
      ]) {
        await expect(
          page.getByRole("heading", { name: heading }),
        ).toBeVisible();
        await next();
      }
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
    }
    if (sexChange) {
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
    }
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
    await page.screenshot({
      path: testInfo.outputPath("sealing.png"),
      fullPage: true,
    });
    await next();
    await expect(
      page.getByRole("heading", {
        name: "Are you attaching supporting documents or additional pages?",
      }),
    ).toBeVisible();
    await page.getByText("No", { exact: true }).click();
    await next();
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
    // Check the project's WCAG AA target. The shared review screen currently
    // uses an h2 without an h1, which Axe reports as a separate best practice.
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath("review.png"),
      fullPage: true,
    });
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
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Finish and Download" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("New York Court Order.pdf");
    expect(await download.failure()).toBeNull();
    await expect(
      page.getByRole("heading", { name: "Form complete!" }),
    ).toBeVisible();
  });
}
