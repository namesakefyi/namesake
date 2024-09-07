import { test } from "./fixtures";

test("passes automated accessibility tests", async ({ expect, page }) => {
  await page.goto("/");
  await expect(page).toBeAccessible();
});

test("has title", async ({ expect, page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Namesake/);
});
