import { exec } from "node:child_process";
import { promisify } from "node:util";
import { test as setup } from "@playwright/test";

const execAsync = promisify(exec);

setup("clean database", async () => {
  console.log("🧹 Cleaning Convex database before tests...");

  try {
    await execAsync("npx convex dev");
    await execAsync("bash scripts/deleteConvexTables.sh");
    console.log("✅ Database cleaned successfully");
  } catch (error) {
    console.error("❌ Failed to clean database:", error);
    throw error;
  }
});
