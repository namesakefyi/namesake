import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
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
    {
      name: "Firefox",
      use: { ...devices["Desktop Firefox"] },
      dependencies: ["Setup"],
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
      dependencies: ["Setup"],
    },
  ],
  webServer: [
    {
      command: "pnpm dev:backend",
      name: "Backend",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "pnpm dev:frontend",
      name: "Frontend",
      url: "http://localhost:5173",
      reuseExistingServer: !process.env.CI,
    },
  ],
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
});
