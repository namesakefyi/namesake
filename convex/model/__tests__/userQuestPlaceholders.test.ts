import { convexTest } from "convex-test";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { vi } from "vitest";
import { CATEGORIES, type Category } from "../../../src/constants";
import { createTestUser } from "../../__tests__/helpers";
import type { Id } from "../../_generated/dataModel";
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

const CORE_CATEGORIES = Object.entries(CATEGORIES)
  .filter(([_, details]) => details.isCore)
  .map(([category]) => category as Category);

describe("userQuestPlaceholders", () => {
  let t: ReturnType<typeof convexTest>;
  let userId: Id<"users">;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(UPDATE_TIMESTAMP);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const setupUser = async () => {
    t = convexTest(schema, modules);
    const { userId: testUserId } = await createTestUser(t);
    userId = testUserId;
  };

  describe("createPlaceholderForUser", () => {
    beforeEach(setupUser);

    it("should create a placeholder and return its ID", async () => {
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

    it("should return existing placeholder ID when creating duplicate", async () => {
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

      expect(placeholderId1).toBe(placeholderId2);

      const placeholders = await t.run(async (ctx) => {
        return await getActivePlaceholdersForUser(ctx, { userId });
      });

      expect(placeholders).toHaveLength(1);
    });

    it("should create different placeholders for different categories", async () => {
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
    beforeEach(setupUser);

    it("should create placeholders for all core categories", async () => {
      await t.run(async (ctx) => {
        await createDefaultPlaceholdersForUser(ctx, { userId });
      });

      const placeholders = await t.run(async (ctx) => {
        return await getActivePlaceholdersForUser(ctx, { userId });
      });

      expect(placeholders).toHaveLength(CORE_CATEGORIES.length);

      const categories = placeholders.map((p) => p.category);
      for (const category of CORE_CATEGORIES) {
        expect(categories).toContain(category);
      }

      // Verify all placeholders are active
      for (const placeholder of placeholders) {
        expect(placeholder.dismissedAt).toBeUndefined();
      }
    });

    it("should not create duplicates when called multiple times", async () => {
      await t.run(async (ctx) => {
        await createDefaultPlaceholdersForUser(ctx, { userId });
      });

      await t.run(async (ctx) => {
        await createDefaultPlaceholdersForUser(ctx, { userId });
      });

      const placeholders = await t.run(async (ctx) => {
        return await getActivePlaceholdersForUser(ctx, { userId });
      });

      expect(placeholders).toHaveLength(CORE_CATEGORIES.length);
      expect(new Set(placeholders.map((p) => p.category)).size).toBe(
        CORE_CATEGORIES.length,
      );
    });
  });

  describe("dismissPlaceholderForUser", () => {
    beforeEach(setupUser);

    it("should dismiss a placeholder and exclude it from active results", async () => {
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

      expect(placeholders).toHaveLength(CORE_CATEGORIES.length - 1);
      expect(placeholders.map((p) => p.category)).not.toContain("courtOrder");
    });

    it("should handle dismissing non-existent placeholder gracefully", async () => {
      await expect(
        t.run(async (ctx) => {
          await dismissPlaceholderForUser(ctx, {
            userId,
            category: "courtOrder",
          });
        }),
      ).resolves.toBeNull();
    });
  });

  describe("getActivePlaceholdersForUser", () => {
    beforeEach(setupUser);

    it("should return only active (non-dismissed) placeholders", async () => {
      await t.run(async (ctx) => {
        await createDefaultPlaceholdersForUser(ctx, { userId });
      });

      // Dismiss two placeholders
      await t.run(async (ctx) => {
        await dismissPlaceholderForUser(ctx, {
          userId,
          category: "courtOrder",
        });
        await dismissPlaceholderForUser(ctx, { userId, category: "stateId" });
      });

      const placeholders = await t.run(async (ctx) => {
        return await getActivePlaceholdersForUser(ctx, { userId });
      });

      expect(placeholders).toHaveLength(CORE_CATEGORIES.length - 2);
      expect(placeholders.map((p) => p.category)).not.toContain("courtOrder");
      expect(placeholders.map((p) => p.category)).not.toContain("stateId");
    });

    it("should return empty array when no placeholders exist", async () => {
      const placeholders = await t.run(async (ctx) => {
        return await getActivePlaceholdersForUser(ctx, { userId });
      });

      expect(placeholders).toHaveLength(0);
    });
  });

  describe("integration with userQuests", () => {
    beforeEach(setupUser);

    it("should automatically dismiss placeholder when core quest is added", async () => {
      await t.run(async (ctx) => {
        await createDefaultPlaceholdersForUser(ctx, { userId });
      });

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

      await t.run(async (ctx) => {
        await UserQuests.createQuestForUser(ctx, { userId, questId });
      });

      const placeholders = await t.run(async (ctx) => {
        return await getActivePlaceholdersForUser(ctx, { userId });
      });

      expect(placeholders).toHaveLength(CORE_CATEGORIES.length - 1);
      expect(placeholders.map((p) => p.category)).not.toContain("courtOrder");
    });

    it("should not dismiss placeholder when non-core quest is added", async () => {
      await t.run(async (ctx) => {
        await createDefaultPlaceholdersForUser(ctx, { userId });
      });

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

      await t.run(async (ctx) => {
        await UserQuests.createQuestForUser(ctx, { userId, questId });
      });

      const placeholders = await t.run(async (ctx) => {
        return await getActivePlaceholdersForUser(ctx, { userId });
      });

      expect(placeholders).toHaveLength(CORE_CATEGORIES.length);
    });
  });
});
