import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import type { Category } from "../../../src/constants";
import { createTestAdmin } from "../../__tests__/helpers";
import { api } from "../../_generated/api";
import schema from "../../schema";
import { modules } from "../../test.setup";
import { createUser, deleteUser, updateUser } from "../authModel";
import * as UserQuests from "../userQuestsModel";

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

      const gettingStarted = await asUser.query(api.userGettingStarted.get);

      expect(gettingStarted).toBeDefined();
      expect(gettingStarted?.status).toBe("inProgress");
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

  describe("deleteUser", () => {
    it("should delete a user and all associated data", async () => {
      const t = convexTest(schema, modules);
      const { asAdmin } = await createTestAdmin(t);

      // Create a user first
      const userId = await t.run(async (ctx) => {
        return await createUser(ctx, {
          name: "User To Delete",
          email: "deleteTest@test.com",
          emailVerified: true,
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      // Verify user exists and has associated data
      const user = await asAdmin.query(api.users.getById, { userId });
      expect(user).toBeDefined();
      expect(user?.name).toBe("User To Delete");

      const userSettings = await asUser.query(
        api.userSettings.getCurrentUserSettings,
      );
      expect(userSettings).toBeDefined();

      const activePlaceholders = await asUser.query(
        api.userQuestPlaceholders.getActive,
      );
      expect(activePlaceholders.length).toBeGreaterThan(0);

      // Delete the user
      await t.run(async (ctx) => {
        await deleteUser(ctx, userId);
      });

      // Verify user is deleted
      const deletedUser = await asAdmin.query(api.users.getById, { userId });
      expect(deletedUser).toBeNull();

      // Verify user settings are deleted
      const deletedSettings = await t.run(async (ctx) => {
        return await ctx.db
          .query("userSettings")
          .withIndex("userId", (q) => q.eq("userId", userId as any))
          .first();
      });
      expect(deletedSettings).toBeNull();

      // Verify user quest placeholders are deleted
      const deletedPlaceholders = await t.run(async (ctx) => {
        return await ctx.db
          .query("userQuestPlaceholders")
          .withIndex("userId", (q) => q.eq("userId", userId as any))
          .collect();
      });
      expect(deletedPlaceholders).toHaveLength(0);
    });

    it("should handle deleting a user with no associated data gracefully", async () => {
      const t = convexTest(schema, modules);

      // Create a user
      const userId = await t.run(async (ctx) => {
        return await createUser(ctx, {
          name: "User To Delete",
          email: "deleteTest2@test.com",
          emailVerified: true,
        });
      });

      // Delete the user
      await t.run(async (ctx) => {
        await deleteUser(ctx, userId);
      });

      // Verify user is deleted without errors
      const deletedUser = await t.run(async (ctx) => {
        return await ctx.db.get(userId as any);
      });
      expect(deletedUser).toBeNull();
    });

    it("should delete user quests when deleting a user", async () => {
      const t = convexTest(schema, modules);
      const { asAdmin, adminId } = await createTestAdmin(t);

      // Create a user
      const userId = await t.run(async (ctx) => {
        return await createUser(ctx, {
          name: "User With Quests",
          email: "questsTest@test.com",
          emailVerified: true,
        });
      });

      // Create a quest
      const questId = await t.run(async (ctx) => {
        return await ctx.db.insert("quests", {
          title: "Court Order",
          category: "courtOrder",
          slug: "court-order",
          creationUser: adminId,
          updatedAt: Date.now(),
        });
      });

      // Create quests for user
      await t.run(async (ctx) => {
        await UserQuests.createQuestForUser(ctx, {
          userId,
          questId,
        });
      });

      // Verify user quest exists
      const userQuests = await t.run(async (ctx) => {
        return await UserQuests.getAllForUser(ctx, { userId });
      });

      expect(userQuests).toHaveLength(1);
      expect(userQuests[0].questId).toBe(questId);

      // Delete the user
      await t.run(async (ctx) => {
        await deleteUser(ctx, userId);
      });

      // Verify user is deleted
      const deletedUser = await asAdmin.query(api.users.getById, { userId });
      expect(deletedUser).toBeNull();

      // Verify no user quests remain for this user
      const remainingUserQuests = await t.run(async (ctx) => {
        return await ctx.db
          .query("userQuests")
          .withIndex("userId", (q) => q.eq("userId", userId as any))
          .collect();
      });
      expect(remainingUserQuests).toHaveLength(0);
    });
  });
});
