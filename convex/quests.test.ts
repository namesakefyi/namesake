import { convexTest } from "convex-test";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

const UPDATE_TIMESTAMP = 662585400000;

describe("quests", () => {
  beforeEach(() => {
    vi.setSystemTime(UPDATE_TIMESTAMP);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getAll", () => {
    it("should return all quests", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      await t.run(async (ctx) => {
        await ctx.db.insert("quests", {
          title: "Test Quest 1",
          slug: "test-quest-1",
          category: "education",
          jurisdiction: "MA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        await ctx.db.insert("quests", {
          title: "Test Quest 2",
          slug: "test-quest-2",
          category: "housing",
          jurisdiction: "NY",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });
      });

      const quests = await asUser.query(api.quests.getAll, {});
      expect(quests).toHaveLength(2);
      expect(quests.map((q) => q.title)).toContain("Test Quest 1");
      expect(quests.map((q) => q.title)).toContain("Test Quest 2");
    });
  });

  describe("getAllActive", () => {
    it("should only return non-deleted quests", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      await t.run(async (ctx) => {
        await ctx.db.insert("quests", {
          title: "Active Quest",
          slug: "active-quest",
          category: "education",
          jurisdiction: "MA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        await ctx.db.insert("quests", {
          title: "Deleted Quest",
          slug: "deleted-quest",
          category: "housing",
          jurisdiction: "NY",
          creationUser: userId,
          deletedAt: Date.now(),
          updatedAt: UPDATE_TIMESTAMP,
        });
      });

      const quests = await asUser.query(api.quests.getAllActive, {});
      expect(quests).toHaveLength(1);
      expect(quests[0].title).toBe("Active Quest");
    });
  });

  describe("create", () => {
    it("should create a quest with required fields", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      const { questId, slug } = await asUser.mutation(api.quests.create, {
        title: "New Quest",
        category: "education",
        jurisdiction: "MA",
      });

      const quest = await asUser.query(api.quests.getById, { questId });

      expect(quest).not.toBeNull();
      expect(quest?.title).toBe("New Quest");
      expect(quest?.category).toBe("education");
      expect(quest?.jurisdiction).toBe("MA");
      expect(quest?.slug).toBe(slug);
      expect(quest?.creationUser).toBe(userId);
      expect(quest?.updatedAt).toBe(UPDATE_TIMESTAMP);
      expect(quest?.updatedBy).toBe(userId);
    });

    it("should generate unique slugs for duplicate titles", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      const quest1 = await asUser.mutation(api.quests.create, {
        title: "Same Title",
        category: "education",
        jurisdiction: "MA",
      });

      const quest2 = await asUser.mutation(api.quests.create, {
        title: "Same Title",
        category: "education",
        jurisdiction: "MA",
      });

      expect(quest1.slug).not.toBe(quest2.slug);
    });
  });

  describe("softDelete", () => {
    it("should mark a quest as deleted", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      const { questId } = await asUser.mutation(api.quests.create, {
        title: "To Delete",
        category: "education",
        jurisdiction: "MA",
      });

      await asUser.mutation(api.quests.softDelete, { questId });

      const quest = await asUser.query(api.quests.getById, { questId });
      expect(quest?.deletedAt).toBeDefined();
      expect(typeof quest?.deletedAt).toBe("number");
      expect(quest?.updatedAt).toBe(UPDATE_TIMESTAMP);
      expect(quest?.updatedBy).toBe(userId);
    });

    it("should be reversible", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      const { questId } = await asUser.mutation(api.quests.create, {
        title: "To Restore",
        category: "education",
        jurisdiction: "MA",
      });

      await asUser.mutation(api.quests.softDelete, { questId });
      await asUser.mutation(api.quests.undoSoftDelete, { questId });

      const quest = await asUser.query(api.quests.getById, { questId });
      expect(quest?.deletedAt).toBeUndefined();
      expect(quest?.updatedAt).toBe(UPDATE_TIMESTAMP);
      expect(quest?.updatedBy).toBe(userId);
    });
  });

  describe("deleteForever", () => {
    it("should permanently delete a quest and its associated userQuests", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      const { questId } = await asUser.mutation(api.quests.create, {
        title: "To Delete Forever",
        category: "education",
        jurisdiction: "MA",
      });

      // Create a userQuest
      await t.run(async (ctx) => {
        await ctx.db.insert("userQuests", {
          userId,
          questId,
          status: "active",
        });
      });

      await asUser.mutation(api.quests.deleteForever, { questId });

      const quest = await asUser.query(api.quests.getById, { questId });
      expect(quest).toBeNull();

      // Verify userQuest is also deleted
      const userQuest = await asUser.query(api.userQuests.getByQuestId, {
        questId,
      });
      expect(userQuest).toBeNull();
    });
  });

  describe("getByCategoryAndJurisdiction", () => {
    it("should return quest matching category and jurisdiction", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      await asUser.mutation(api.quests.create, {
        title: "Court Order Quest",
        category: "courtOrder",
        jurisdiction: "MA",
      });

      const quest = await asUser.query(
        api.quests.getByCategoryAndJurisdiction,
        {
          category: "courtOrder",
          jurisdiction: "MA",
        },
      );

      expect(quest).not.toBeNull();
      expect(quest?.title).toBe("Court Order Quest");
      expect(quest?.category).toBe("courtOrder");
      expect(quest?.jurisdiction).toBe("MA");
    });

    it("should return null if jurisdiction is not provided", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      const quest = await asUser.query(
        api.quests.getByCategoryAndJurisdiction,
        {
          category: "courtOrder",
          jurisdiction: undefined,
        },
      );

      expect(quest).toBeNull();
    });
  });
});
