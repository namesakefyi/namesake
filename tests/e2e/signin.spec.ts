// import { faker } from "@faker-js/faker";
// import { test } from "./fixtures";

// test("displays error message for invalid fields", async ({ expect, page }) => {
//   await page.goto("/signin");

//   await page.getByRole("textbox", { name: "Email" }).click();
//   await page.getByRole("textbox", { name: "Email" }).fill("hi");
//   await page.getByRole("button", { name: "Sign in" }).click();

//   const errors = page.locator("[slot='errorMessage']");

//   await expect(errors).toHaveCount(2);

//   await expect(errors.nth(0)).toHaveText(
//     "Please include an '@' in the email address. 'hi' is missing an '@'.",
//   );

//   await expect(errors.nth(1)).toHaveText("Please fill out this field.");
// });

// test("displays success message on valid registration", async ({
//   expect,
//   page,
// }) => {
//   await page.goto("/signin");

//   const email = faker.internet.email({
//     firstName: faker.person.firstName(),
//     lastName: faker.person.lastName(),
//   });

//   const password = faker.internet.password();

//   await page.getByRole("textbox", { name: "Email" }).click();
//   await page.getByRole("textbox", { name: "Email" }).fill(email);

//   await page.getByRole("textbox", { name: "Password" }).click();
//   await page.getByRole("textbox", { name: "Password" }).fill(password);

//   await page.getByRole("button", { name: "Sign in" }).click();

// });

// // // Test: Alerts the user if the email address for registration already exists
// // test("Alerts user if email already exists", async ({ expect, page }) => {
// //   await page.goto("/signin");
// //   await page.fill("input[name='email']", "existing@example.com");
// //   await page.fill("input[name='password']", "ValidPass123!");
// //   await page.click("button[type='submit']");
// //   await expect(page.locator(".error-message")).toHaveText(
// //     "Email already exists",
// //   );
// // });
