import { convexTest } from "convex-test";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { vi } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";
import { modules } from "../test.setup";
import { createTestUser } from "./helpers";

const UPDATE_TIMESTAMP = Date.now();

describe("userQuests", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(UPDATE_TIMESTAMP);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getAll", () => {
    it("should return all user quests", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      await t.run(async (ctx) => {
        // Create quests
        const quest1Id = await ctx.db.insert("quests", {
          title: "Test Quest 1",
          slug: "test-quest-1",
          category: "Test Category",
          jurisdiction: "Test Jurisdiction",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        const quest2Id = await ctx.db.insert("quests", {
          title: "Test Quest 2",
          slug: "test-quest-2",
          category: "Test Category",
          jurisdiction: "Test Jurisdiction",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        // Create user quests
        await ctx.db.insert("userQuests", {
          userId,
          questId: quest1Id,
          status: "active",
        });

        await ctx.db.insert("userQuests", {
          userId,
          questId: quest2Id,
          status: "completed",
        });
      });

      const quests = await asUser.query(api.userQuests.getAll, {});
      expect(quests).toHaveLength(2);
      expect(quests.map((q) => q.title)).toContain("Test Quest 1");
      expect(quests.map((q) => q.title)).toContain("Test Quest 2");
    });

    it("should not return deleted quests", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      await t.run(async (ctx) => {
        const questId = await ctx.db.insert("quests", {
          title: "Deleted Quest",
          slug: "deleted-quest",
          category: "Test Category",
          jurisdiction: "Test Jurisdiction",
          creationUser: userId,
          deletedAt: Date.now(),
          updatedAt: UPDATE_TIMESTAMP,
        });

        await ctx.db.insert("userQuests", {
          userId,
          questId,
          status: "active",
        });
      });

      const quests = await asUser.query(api.userQuests.getAll, {});
      expect(quests).toHaveLength(0);
    });
  });

  describe("count", () => {
    it("should return count of user quests", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      await t.run(async (ctx) => {
        const questId = await ctx.db.insert("quests", {
          title: "Test Quest",
          slug: "test-quest",
          category: "Test Category",
          jurisdiction: "Test Jurisdiction",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        await ctx.db.insert("userQuests", {
          userId,
          questId,
          status: "active",
        });
      });

      const count = await asUser.query(api.userQuests.count, {});
      expect(count).toBe(1);
    });
  });

  describe("create", () => {
    it("should create a user quest", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      const questId = await asUser.run(async (ctx) => {
        return await ctx.db.insert("quests", {
          title: "Test Quest",
          slug: "test-quest",
          category: "Test Category",
          jurisdiction: "Test Jurisdiction",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });
      });

      await asUser.mutation(api.userQuests.create, { questId });

      await t.run(async (ctx) => {
        const userQuest = await ctx.db
          .query("userQuests")
          .withIndex("userId", (q) => q.eq("userId", userId))
          .first();
        expect(userQuest?.questId).toBe(questId);
      });
    });

    it("should set a default status", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      const questId = await asUser.run(async (ctx) => {
        return await ctx.db.insert("quests", {
          title: "Test Quest",
          slug: "test-quest",
          category: "education",
          jurisdiction: "MA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });
      });

      await asUser.mutation(api.userQuests.create, { questId });

      const status = await asUser.query(api.userQuests.getStatus, { questId });
      expect(status).toBe("notStarted");
    });

    it("should throw if quest already exists", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      const questId = await t.run(async (ctx) => {
        return await ctx.db.insert("quests", {
          title: "Test Quest",
          slug: "test-quest",
          category: "Test Category",
          jurisdiction: "Test Jurisdiction",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });
      });

      await asUser.mutation(api.userQuests.create, { questId });

      await expect(
        asUser.mutation(api.userQuests.create, { questId }),
      ).rejects.toThrow("Quest already exists for user");
    });
  });

  describe("setStatus", async () => {
    it("should update quest status", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      const questId = await t.run(async (ctx) => {
        return ctx.db.insert("quests", {
          title: "Test Quest",
          slug: "test-quest",
          category: "Test Category",
          jurisdiction: "Test Jurisdiction",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });
      });

      await asUser.mutation(api.userQuests.create, { questId });

      await asUser.mutation(api.userQuests.setStatus, {
        questId,
        status: "complete",
      });

      const status = await asUser.query(api.userQuests.getStatus, { questId });
      expect(status).toBe("complete");
    });

    it("should throw error if status is invalid", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      const questId = await t.run(async (ctx) => {
        return ctx.db.insert("quests", {
          title: "Test Quest",
          slug: "test-quest",
          category: "education",
          jurisdiction: "MA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });
      });

      await asUser.mutation(api.userQuests.create, { questId });

      await expect(
        asUser.mutation(api.userQuests.setStatus, {
          questId,
          status: "invalid",
        }),
      ).rejects.toThrow("Invalid status");
    });

    it("should properly manage timestamps through status transitions", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      const questId = await t.run(async (ctx) => {
        return ctx.db.insert("quests", {
          title: "Test Quest",
          slug: "test-quest",
          category: "Test Category",
          jurisdiction: "Test Jurisdiction",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });
      });

      await asUser.mutation(api.userQuests.create, { questId });

      // Initial state check
      let userQuest = await asUser.query(api.userQuests.getByQuestId, {
        questId,
      });
      expect(userQuest?.status).toBe("notStarted");
      expect(userQuest?.startedAt).toBeUndefined();
      expect(userQuest?.completedAt).toBeUndefined();

      // Transition to inProgress
      await asUser.mutation(api.userQuests.setStatus, {
        questId,
        status: "inProgress",
      });

      userQuest = await asUser.query(api.userQuests.getByQuestId, { questId });
      expect(userQuest?.status).toBe("inProgress");
      expect(userQuest?.startedAt).toBe(UPDATE_TIMESTAMP);
      expect(userQuest?.completedAt).toBeUndefined();

      // Transition to complete
      await asUser.mutation(api.userQuests.setStatus, {
        questId,
        status: "complete",
      });

      userQuest = await asUser.query(api.userQuests.getByQuestId, { questId });
      expect(userQuest?.status).toBe("complete");
      expect(userQuest?.startedAt).toBe(UPDATE_TIMESTAMP); // startedAt should be preserved
      expect(userQuest?.completedAt).toBe(UPDATE_TIMESTAMP);
    });

    it("should remove completedAt when status changed away from complete", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      const questId = await t.run(async (ctx) => {
        return ctx.db.insert("quests", {
          title: "Test Quest",
          slug: "test-quest",
          category: "Test Category",
          jurisdiction: "Test Jurisdiction",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });
      });

      await asUser.mutation(api.userQuests.create, { questId });

      await asUser.mutation(api.userQuests.setStatus, {
        questId,
        status: "complete",
      });

      const updatedUserQuest = await asUser.query(api.userQuests.getByQuestId, {
        questId,
      });

      expect(updatedUserQuest?.status).toBe("complete");
      expect(updatedUserQuest?.completedAt).toBeTypeOf("number");

      await asUser.mutation(api.userQuests.setStatus, {
        questId,
        status: "notStarted",
      });

      const updatedQuest = await asUser.query(api.userQuests.getByQuestId, {
        questId,
      });

      expect(updatedQuest?.status).toBe("notStarted");
      expect(updatedQuest?.completedAt).toBeUndefined();
    });
  });

  describe("deleteForever", () => {
    it("should delete a user quest", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      const questId = await t.run(async (ctx) => {
        return await ctx.db.insert("quests", {
          title: "Test Quest",
          slug: "test-quest",
          category: "Test Category",
          jurisdiction: "Test Jurisdiction",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });
      });

      await asUser.mutation(api.userQuests.create, { questId });

      expect(
        await asUser.query(api.userQuests.getByQuestId, { questId }),
      ).not.toBeNull();

      await asUser.mutation(api.userQuests.deleteForever, { questId });

      expect(
        await asUser.query(api.userQuests.getByQuestId, { questId }),
      ).toBeNull();
    });
  });

  describe("getByCategory", () => {
    it("should return quests grouped by category", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      await t.run(async (ctx) => {
        const quest1Id = await ctx.db.insert("quests", {
          title: "Test Quest 1",
          slug: "test-quest-1",
          category: "education",
          jurisdiction: "Test Jurisdiction",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        const quest2Id = await ctx.db.insert("quests", {
          title: "Test Quest 2",
          slug: "test-quest-2",
          category: "housing",
          jurisdiction: "Test Jurisdiction",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        await ctx.db.insert("userQuests", {
          userId,
          questId: quest1Id,
          status: "active",
        });

        await ctx.db.insert("userQuests", {
          userId,
          questId: quest2Id,
          status: "active",
        });
      });

      const questsByCategory = await asUser.query(
        api.userQuests.getByCategory,
        {},
      );
      expect(Object.keys(questsByCategory)).toContain("education");
      expect(Object.keys(questsByCategory)).toContain("housing");
      expect(questsByCategory.education).toHaveLength(1);
      expect(questsByCategory.housing).toHaveLength(1);
    });
  });
});
