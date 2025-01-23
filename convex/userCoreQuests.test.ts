import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

describe("userCoreQuests", () => {
  describe("getAll", () => {
    it("should return all core quests", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      await t.run(async (ctx) => {
        await ctx.db.insert("userCoreQuests", {
          userId,
          type: "court-order",
          status: "notStarted",
        });

        await ctx.db.insert("userCoreQuests", {
          userId,
          type: "state-id",
          status: "inProgress",
        });

        await ctx.db.insert("userCoreQuests", {
          userId,
          type: "passport",
          status: "complete",
        });
      });

      const coreQuests = await asUser.query(api.userCoreQuests.getAll, {});
      expect(coreQuests).toHaveLength(3);
    });
  });

  describe("count", () => {
    it("should return the total number of core quests", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      await t.run(async (ctx) => {
        // Manually insert core quests for the user
        await ctx.db.insert("userCoreQuests", {
          userId,
          type: "court-order",
          status: "notStarted",
        });

        await ctx.db.insert("userCoreQuests", {
          userId,
          type: "state-id",
          status: "inProgress",
        });

        await ctx.db.insert("userCoreQuests", {
          userId,
          type: "passport",
          status: "complete",
        });
      });

      const coreQuestCount = await asUser.query(api.userCoreQuests.count, {});
      expect(coreQuestCount).toBe(3);
    });
  });

  describe("countCompleted", () => {
    it("should return the number of completed core quests", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      await t.run(async (ctx) => {
        await ctx.db.insert("userCoreQuests", {
          userId,
          type: "court-order",
          status: "notStarted",
        });

        await ctx.db.insert("userCoreQuests", {
          userId,
          type: "state-id",
          status: "inProgress",
        });

        await ctx.db.insert("userCoreQuests", {
          userId,
          type: "passport",
          status: "complete",
          completedAt: Date.now(),
        });

        await ctx.db.insert("userCoreQuests", {
          userId,
          type: "social-security",
          status: "complete",
          completedAt: Date.now(),
        });
      });

      const completedCoreQuestCount = await asUser.query(
        api.userCoreQuests.countCompleted,
        {},
      );
      expect(completedCoreQuestCount).toBe(2);
    });
  });

  describe("getByType", () => {
    it("should return core quests for a specific type", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      await t.run(async (ctx) => {
        await ctx.db.insert("userCoreQuests", {
          userId,
          type: "court-order",
          status: "notStarted",
        });

        await ctx.db.insert("userCoreQuests", {
          userId,
          type: "state-id",
          status: "inProgress",
        });

        await ctx.db.insert("userCoreQuests", {
          userId,
          type: "passport",
          status: "complete",
          completedAt: Date.now(),
        });
      });

      const courtOrderQuest = await asUser.query(api.userCoreQuests.getByType, {
        type: "court-order",
      });

      expect(courtOrderQuest).toBeDefined();
      expect(courtOrderQuest?.type).toBe("court-order");
      expect(courtOrderQuest?.status).toBe("notStarted");
    });
  });

  describe("setStatus", () => {
    it("should update core quest status", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      await t.run(async (ctx) => {
        return ctx.db.insert("userCoreQuests", {
          userId,
          type: "court-order",
          status: "notStarted",
        });
      });

      await asUser.mutation(api.userCoreQuests.setStatus, {
        type: "court-order",
        status: "complete",
      });

      const status = await asUser.query(api.userCoreQuests.getByType, {
        type: "court-order",
      });
      expect(status).toBeDefined();
      expect(status?.type).toBe("court-order");
      expect(status?.status).toBe("complete");
    });

    it("should throw error if status is invalid", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      await t.run(async (ctx) => {
        return ctx.db.insert("userCoreQuests", {
          userId,
          type: "court-order",
          status: "notStarted",
        });
      });

      await expect(
        asUser.mutation(api.userCoreQuests.setStatus, {
          type: "court-order",
          status: "invalid",
        }),
      ).rejects.toThrow("Invalid status");
    });

    it("should add completedAt when status changed to complete", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      await t.run(async (ctx) => {
        return ctx.db.insert("userCoreQuests", {
          userId,
          type: "court-order",
          status: "notStarted",
        });
      });

      const userCoreQuest = await asUser.query(api.userCoreQuests.getByType, {
        type: "court-order",
      });

      expect(userCoreQuest?.status).toBe("notStarted");
      expect(userCoreQuest?.completedAt).toBeUndefined();

      await asUser.mutation(api.userCoreQuests.setStatus, {
        type: "court-order",
        status: "complete",
      });

      const updatedUserQuest = await asUser.query(
        api.userCoreQuests.getByType,
        {
          type: "court-order",
        },
      );

      expect(updatedUserQuest?.status).toBe("complete");
      expect(updatedUserQuest?.completedAt).toBeTypeOf("number"); // Unix timestamp
    });

    it("should remove completedAt when status changed away from complete", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      await t.run(async (ctx) => {
        return ctx.db.insert("userCoreQuests", {
          userId,
          type: "court-order",
          status: "notStarted",
        });
      });

      await asUser.mutation(api.userCoreQuests.setStatus, {
        type: "court-order",
        status: "complete",
      });

      const completedQuest = await asUser.query(api.userCoreQuests.getByType, {
        type: "court-order",
      });

      expect(completedQuest?.status).toBe("complete");
      expect(completedQuest?.completedAt).toBeTypeOf("number");

      await asUser.mutation(api.userCoreQuests.setStatus, {
        type: "court-order",
        status: "notStarted",
      });

      const notStartedQuest = await asUser.query(api.userCoreQuests.getByType, {
        type: "court-order",
      });

      expect(notStartedQuest?.status).toBe("notStarted");
      expect(notStartedQuest?.completedAt).toBeUndefined();
    });
  });
});
