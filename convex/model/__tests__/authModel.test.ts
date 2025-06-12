import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { createTestAdmin } from "../../__tests__/helpers";
import { api } from "../../_generated/api";
import schema from "../../schema";
import { modules } from "../../test.setup";
import { createUser, updateUser } from "../authModel";

describe("authModel", () => {
  describe("createUser", () => {
    it("should create a new user with default settings", async () => {
      const t = convexTest(schema, modules);
      const { asAdmin } = await createTestAdmin(t);

      const userId = await t.run(async (ctx) => {
        return await createUser(ctx, {
          name: "Test User",
          email: "testUser@test.com",
          emailVerified: true,
        });
      });

      const asUser = t.withIdentity({ subject: userId });
      const user = await asAdmin.query(api.users.getById, {
        userId,
      });

      expect(user?.name).toBe("Test User");
      expect(user?.email).toBe("testUser@test.com");
      expect(user?.emailVerified).toBe(true);
      expect(user?.role).toBe("user");

      const userSettings = await asUser.query(
        api.userSettings.getCurrentUserSettings,
      );

      expect(userSettings).toBeDefined();
      expect(userSettings?.theme).toBe("system");
      expect(userSettings?.color).toBe("rainbow");
    });
  });

  describe("updateUser", () => {
    it("should update an existing user", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await createUser(ctx, {
          name: "Original Name",
          email: "updateTest@test.com",
          emailVerified: true,
        });
      });

      await t.run(async (ctx) => {
        await updateUser(ctx, {
          userId,
          name: "Updated Name",
          email: "updateTest@test.com",
          emailVerified: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      const user = await t.run(async (ctx) => {
        return await ctx.db.get(userId);
      });

      expect(user?.name).toBe("Updated Name");
    });
  });
});
