import { expect, test } from "@playwright/test";

test.describe("directory", () => {
  test("filters entries by language", async ({ page }) => {
    await page.goto("/directory");

    await page.getByRole("combobox", { name: "Language" }).selectOption("es");

    await expect(page).toHaveURL(/language=es/);
    await expect(page.locator("#directory-results")).not.toHaveAttribute(
      "aria-busy",
      "true",
    );

    const languageLists = page.getByRole("list", { name: "Languages" });
    await expect(languageLists).not.toHaveCount(0);
    await expect(languageLists.filter({ hasNotText: "Spanish" })).toHaveCount(
      0,
    );
  });

  test("applies a language from the URL and resets it", async ({ page }) => {
    await page.goto("/directory?language=es");

    const select = page.getByRole("combobox", { name: "Language" });
    await expect(select).toHaveValue("es");

    await page.getByRole("link", { name: "Reset" }).click();

    await expect(page).not.toHaveURL(/language=/);
    await expect(select).toHaveValue("");
  });
});
