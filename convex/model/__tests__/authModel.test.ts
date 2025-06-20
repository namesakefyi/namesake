import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import type { Category } from "../../../src/constants";
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

    it("should create default placeholders for the user", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await createUser(ctx, {
          name: "Test User",
          email: "testUser@test.com",
          emailVerified: true,
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      const activePlaceholders = await asUser.query(
        api.userQuestPlaceholders.getActive,
      );

      const expectedCoreCategories: Category[] = [
        "courtOrder",
        "stateId",
        "socialSecurity",
        "passport",
        "birthCertificate",
      ];

      expect(activePlaceholders).toHaveLength(expectedCoreCategories.length);

      const placeholderCategories = activePlaceholders.map((p) => p.category);
      for (const category of expectedCoreCategories) {
        expect(placeholderCategories).toContain(category);
      }

      // Verify that all placeholders are active (not dismissed)
      for (const placeholder of activePlaceholders) {
        expect(placeholder.dismissedAt).toBeUndefined();
        expect(placeholder.userId).toBe(userId);
      }
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
