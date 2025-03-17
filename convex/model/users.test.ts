import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";
import { modules } from "../test.setup";

describe("users", () => {
  describe("getByEmail", () => {
    it("should return user by email", async () => {
      const t = convexTest(schema, modules);

      await t.run(async (ctx) => {
        await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
          name: "Test User",
        });
      });

      const user = await t.query(api.users.getByEmail, {
        email: "test@example.com",
      });
      expect(user?.name).toBe("Test User");
    });

    it("should return null if user not found", async () => {
      const t = convexTest(schema, modules);
      const user = await t.query(api.users.getByEmail, {
        email: "nonexistent@example.com",
      });
      expect(user).toBeNull();
    });
  });
});
