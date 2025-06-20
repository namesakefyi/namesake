import { convexTest } from "convex-test";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { vi } from "vitest";
import type { Category } from "../../../src/constants";
import schema from "../../schema";
import { modules } from "../../test.setup";
import {
  createDefaultPlaceholdersForUser,
  createPlaceholderForUser,
  dismissPlaceholderForUser,
  getActivePlaceholdersForUser,
} from "../userQuestPlaceholdersModel";
import * as UserQuests from "../userQuestsModel";

const UPDATE_TIMESTAMP = Date.now();

describe("userQuestPlaceholders", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(UPDATE_TIMESTAMP);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("createPlaceholderForUser", () => {
    it("should create a placeholder for a user and category", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "testUser@test.com",
          role: "user",
        });
      });

      const placeholderId = await t.run(async (ctx) => {
        return await createPlaceholderForUser(ctx, {
          userId,
          category: "courtOrder",
        });
      });

      expect(placeholderId).toBeDefined();

      const placeholders = await t.run(async (ctx) => {
        return await getActivePlaceholdersForUser(ctx, { userId });
      });

      expect(placeholders).toHaveLength(1);
      expect(placeholders[0].category).toBe("courtOrder");
      expect(placeholders[0].dismissedAt).toBeUndefined();
    });

    it("should not create duplicate placeholders", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "testUser@test.com",
          role: "user",
        });
      });

      // Create placeholder twice
      const placeholderId1 = await t.run(async (ctx) => {
        return await createPlaceholderForUser(ctx, {
          userId,
          category: "courtOrder",
        });
      });

      const placeholderId2 = await t.run(async (ctx) => {
        return await createPlaceholderForUser(ctx, {
          userId,
          category: "courtOrder",
        });
      });

      // Should return the same ID both times
      expect(placeholderId1).toBe(placeholderId2);

      const placeholders = await t.run(async (ctx) => {
        return await getActivePlaceholdersForUser(ctx, { userId });
      });

      // Should only have one placeholder
      expect(placeholders).toHaveLength(1);
      expect(placeholders[0].category).toBe("courtOrder");
    });

    it("should create multiple placeholders for different categories", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "testUser@test.com",
          role: "user",
        });
      });

      const placeholderId1 = await t.run(async (ctx) => {
        return await createPlaceholderForUser(ctx, {
          userId,
          category: "courtOrder",
        });
      });

      const placeholderId2 = await t.run(async (ctx) => {
        return await createPlaceholderForUser(ctx, {
          userId,
          category: "passport",
        });
      });

      // Should return different IDs
      expect(placeholderId1).not.toBe(placeholderId2);

      const placeholders = await t.run(async (ctx) => {
        return await getActivePlaceholdersForUser(ctx, { userId });
      });

      expect(placeholders).toHaveLength(2);
      const categories = placeholders.map((p) => p.category);
      expect(categories).toContain("courtOrder");
      expect(categories).toContain("passport");
    });
  });

  describe("createDefaultPlaceholdersForUser", () => {
    it("should create placeholders for all core categories", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "testUser@test.com",
          role: "user",
        });
      });

      await t.run(async (ctx) => {
        await createDefaultPlaceholdersForUser(ctx, { userId });
      });

      const placeholders = await t.run(async (ctx) => {
        return await getActivePlaceholdersForUser(ctx, { userId });
      });

      expect(placeholders).toHaveLength(5);

      const categories = placeholders.map((p) => p.category);
      expect(categories).toContain("courtOrder");
      expect(categories).toContain("stateId");
      expect(categories).toContain("socialSecurity");
      expect(categories).toContain("passport");
      expect(categories).toContain("birthCertificate");

      // Verify all placeholders are active (not dismissed)
      for (const placeholder of placeholders) {
        expect(placeholder.dismissedAt).toBeUndefined();
      }
    });

    it("should not create duplicate placeholders when called multiple times", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "testUser@test.com",
          role: "user",
        });
      });

      // Call createDefaultPlaceholdersForUser twice
      await t.run(async (ctx) => {
        await createDefaultPlaceholdersForUser(ctx, { userId });
      });

      await t.run(async (ctx) => {
        await createDefaultPlaceholdersForUser(ctx, { userId });
      });

      // Check that we still only have 5 placeholders (not 10)
      const placeholders = await t.run(async (ctx) => {
        return await getActivePlaceholdersForUser(ctx, { userId });
      });

      expect(placeholders).toHaveLength(5);

      // Verify we have exactly one placeholder per core category
      const categories = placeholders.map((p) => p.category);
      expect(categories).toContain("courtOrder");
      expect(categories).toContain("stateId");
      expect(categories).toContain("socialSecurity");
      expect(categories).toContain("passport");
      expect(categories).toContain("birthCertificate");

      // Check that there are no duplicates by comparing array lengths
      expect(categories.length).toBe(new Set(categories).size);
    });

    it("should work correctly when some placeholders already exist", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "testUser@test.com",
          role: "user",
        });
      });

      // Create one placeholder manually first
      await t.run(async (ctx) => {
        await createPlaceholderForUser(ctx, { userId, category: "courtOrder" });
      });

      // Then create all default placeholders
      await t.run(async (ctx) => {
        await createDefaultPlaceholdersForUser(ctx, { userId });
      });

      const placeholders = await t.run(async (ctx) => {
        return await getActivePlaceholdersForUser(ctx, { userId });
      });

      expect(placeholders).toHaveLength(5);
      const categories = placeholders.map((p) => p.category);
      expect(categories).toContain("courtOrder");
      expect(categories).toContain("stateId");
      expect(categories).toContain("socialSecurity");
      expect(categories).toContain("passport");
      expect(categories).toContain("birthCertificate");
    });
  });

  describe("dismissPlaceholderForUser", () => {
    it("should dismiss a placeholder", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "testUser@test.com",
          role: "user",
        });
      });

      await t.run(async (ctx) => {
        await createDefaultPlaceholdersForUser(ctx, { userId });
      });

      await t.run(async (ctx) => {
        await dismissPlaceholderForUser(ctx, {
          userId,
          category: "courtOrder",
        });
      });

      const placeholders = await t.run(async (ctx) => {
        return await getActivePlaceholdersForUser(ctx, { userId });
      });

      expect(placeholders).toHaveLength(4);

      const categories = placeholders.map((p) => p.category);
      expect(categories).not.toContain("courtOrder");
    });

    it("should return null if placeholder not found", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "testUser@test.com",
          role: "user",
        });
      });

      await expect(
        t.run(async (ctx) => {
          await dismissPlaceholderForUser(ctx, {
            userId,
            category: "courtOrder",
          });
        }),
      ).resolves.toBeNull();
    });

    it("should not affect other placeholders when dismissing one", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "testUser@test.com",
          role: "user",
        });
      });

      await t.run(async (ctx) => {
        await createDefaultPlaceholdersForUser(ctx, { userId });
      });

      await t.run(async (ctx) => {
        await dismissPlaceholderForUser(ctx, {
          userId,
          category: "courtOrder",
        });
      });

      const placeholders = await t.run(async (ctx) => {
        return await getActivePlaceholdersForUser(ctx, { userId });
      });

      expect(placeholders).toHaveLength(4);
      const categories = placeholders.map((p) => p.category);
      expect(categories).toContain("stateId");
      expect(categories).toContain("socialSecurity");
      expect(categories).toContain("passport");
      expect(categories).toContain("birthCertificate");
    });
  });

  describe("getActivePlaceholdersForUser", () => {
    it("should return only active placeholders", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "testUser@test.com",
          role: "user",
        });
      });

      await t.run(async (ctx) => {
        await createDefaultPlaceholdersForUser(ctx, { userId });
      });

      await t.run(async (ctx) => {
        await dismissPlaceholderForUser(ctx, {
          userId,
          category: "courtOrder",
        });
      });

      await t.run(async (ctx) => {
        await dismissPlaceholderForUser(ctx, {
          userId,
          category: "stateId",
        });
      });

      const placeholders = await t.run(async (ctx) => {
        return await getActivePlaceholdersForUser(ctx, { userId });
      });

      expect(placeholders).toHaveLength(3);

      const categories = placeholders.map((p) => p.category);
      expect(categories).not.toContain("courtOrder");
      expect(categories).not.toContain("stateId");
      expect(categories).toContain("socialSecurity");
      expect(categories).toContain("passport");
      expect(categories).toContain("birthCertificate");
    });

    it("should return empty array when no placeholders exist", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "testUser@test.com",
          role: "user",
        });
      });

      const placeholders = await t.run(async (ctx) => {
        return await getActivePlaceholdersForUser(ctx, { userId });
      });

      expect(placeholders).toHaveLength(0);
    });

    it("should return empty array when all placeholders are dismissed", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "testUser@test.com",
          role: "user",
        });
      });

      await t.run(async (ctx) => {
        await createDefaultPlaceholdersForUser(ctx, { userId });
      });

      // Dismiss all placeholders
      const coreCategories: Category[] = [
        "courtOrder",
        "stateId",
        "socialSecurity",
        "passport",
        "birthCertificate",
      ];
      for (const category of coreCategories) {
        await t.run(async (ctx) => {
          await dismissPlaceholderForUser(ctx, { userId, category });
        });
      }

      const placeholders = await t.run(async (ctx) => {
        return await getActivePlaceholdersForUser(ctx, { userId });
      });

      expect(placeholders).toHaveLength(0);
    });
  });

  describe("integration with userQuests", () => {
    it("should automatically dismiss placeholder when core quest is added", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "testUser@test.com",
          role: "user",
        });
      });

      // Create placeholders first
      await t.run(async (ctx) => {
        await createDefaultPlaceholdersForUser(ctx, { userId });
      });

      // Create a core quest
      const questId = await t.run(async (ctx) => {
        return await ctx.db.insert("quests", {
          title: "Court Order Quest",
          slug: "court-order",
          category: "courtOrder",
          jurisdiction: "CA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });
      });

      // Add the quest to user's quests (this should dismiss the placeholder)
      await t.run(async (ctx) => {
        await UserQuests.createQuestForUser(ctx, { userId, questId });
      });

      // Check that the placeholder was dismissed
      const placeholders = await t.run(async (ctx) => {
        return await getActivePlaceholdersForUser(ctx, { userId });
      });

      expect(placeholders).toHaveLength(4);
      const categories = placeholders.map((p) => p.category);
      expect(categories).not.toContain("courtOrder");
    });

    it("should not dismiss placeholder when non-core quest is added", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "testUser@test.com",
          role: "user",
        });
      });

      // Create placeholders first
      await t.run(async (ctx) => {
        await createDefaultPlaceholdersForUser(ctx, { userId });
      });

      // Create a non-core quest
      const questId = await t.run(async (ctx) => {
        return await ctx.db.insert("quests", {
          title: "Education Quest",
          slug: "education-quest",
          category: "education",
          jurisdiction: "CA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });
      });

      // Add the quest to user's quests (this should NOT dismiss any placeholders)
      await t.run(async (ctx) => {
        await UserQuests.createQuestForUser(ctx, { userId, questId });
      });

      // Check that all placeholders are still active
      const placeholders = await t.run(async (ctx) => {
        return await getActivePlaceholdersForUser(ctx, { userId });
      });

      expect(placeholders).toHaveLength(5);
      const categories = placeholders.map((p) => p.category);
      expect(categories).toContain("courtOrder");
      expect(categories).toContain("stateId");
      expect(categories).toContain("socialSecurity");
      expect(categories).toContain("passport");
      expect(categories).toContain("birthCertificate");
    });

    it("should handle multiple core quests being added", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "testUser@test.com",
          role: "user",
        });
      });

      // Create placeholders first
      await t.run(async (ctx) => {
        await createDefaultPlaceholdersForUser(ctx, { userId });
      });

      // Create multiple core quests
      const questIds = await t.run(async (ctx) => {
        const courtOrderQuestId = await ctx.db.insert("quests", {
          title: "Court Order Quest",
          slug: "court-order",
          category: "courtOrder",
          jurisdiction: "CA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        const passportQuestId = await ctx.db.insert("quests", {
          title: "Passport Quest",
          slug: "passport",
          category: "passport",
          jurisdiction: "CA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        return [courtOrderQuestId, passportQuestId];
      });

      // Add both quests to user's quests
      await t.run(async (ctx) => {
        await UserQuests.createQuestForUser(ctx, {
          userId,
          questId: questIds[0],
        });
        await UserQuests.createQuestForUser(ctx, {
          userId,
          questId: questIds[1],
        });
      });

      // Check that both placeholders were dismissed
      const placeholders = await t.run(async (ctx) => {
        return await getActivePlaceholdersForUser(ctx, { userId });
      });

      expect(placeholders).toHaveLength(3);
      const categories = placeholders.map((p) => p.category);
      expect(categories).not.toContain("courtOrder");
      expect(categories).not.toContain("passport");
      expect(categories).toContain("stateId");
      expect(categories).toContain("socialSecurity");
      expect(categories).toContain("birthCertificate");
    });
  });
});
