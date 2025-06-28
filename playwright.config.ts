import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  /* Run tests in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Limit the number of workers on CI */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",

  /* Shared settings for all projects. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:5173",
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    /* Capture screenshot on test failure. */
    screenshot: "only-on-failure",
  },

  /* Configure projects to run in different browsers. */
  projects: [
    {
      name: "Setup",
      testMatch: /global\.setup\.ts/,
    },
    {
      name: "Chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["Setup"],
    },
  ],

  /* Run local dev server before starting the tests. */
  webServer: [
    {
      name: "Backend",
      command: "npx convex dev",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "pnpm dev:frontend",
      name: "Frontend",
      url: "http://localhost:5173",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
