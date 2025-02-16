import { convexTest } from "convex-test";
import type { TestConvex } from "convex-test";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import schema from "./schema";
import { modules } from "./test.setup";

const UPDATE_TIMESTAMP = new Date("1969-06-28T01:20:00-04:00").getTime();

const expectQuestUpdated = async (
  t: TestConvex<typeof schema>,
  questId: Id<"quests">,
  userId: Id<"users">,
) => {
  const updatedQuest = await t.run(async (ctx) => {
    return await ctx.db.get(questId);
  });
  expect(updatedQuest?.updatedAt).toBe(UPDATE_TIMESTAMP);
  expect(updatedQuest?.updatedBy).toBe(userId);
};

describe("questSteps", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(UPDATE_TIMESTAMP);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("create", () => {
    it("should create a quest step", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

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

      const questStepId = await asUser.mutation(api.questSteps.create, {
        questId,
        title: "Test Step",
        content: "Test Content",
        button: {
          text: "Click me",
          url: "https://example.com",
        },
      });

      const questStep = await asUser.query(api.questSteps.getById, {
        questStepId,
      });

      expect(questStep).toMatchObject({
        questId,
        title: "Test Step",
        content: "Test Content",
        button: {
          text: "Click me",
          url: "https://example.com",
        },
      });
    });

    it("should create a quest step without button", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

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

      const questStepId = await asUser.mutation(api.questSteps.create, {
        questId,
        title: "Test Step",
        content: "Test Content",
      });

      const questStep = await asUser.query(api.questSteps.getById, {
        questStepId,
      });

      expect(questStep).toMatchObject({
        questId,
        title: "Test Step",
        content: "Test Content",
      });
      expect(questStep?.button).toBeUndefined();

      await expectQuestUpdated(t, questId, userId);
    });
  });

  describe("getByIds", () => {
    it("should return multiple quest steps", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

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

      const step1Id = await asUser.mutation(api.questSteps.create, {
        questId,
        title: "Step 1",
        content: "Content 1",
      });

      const step2Id = await asUser.mutation(api.questSteps.create, {
        questId,
        title: "Step 2",
        content: "Content 2",
      });

      const steps = await asUser.query(api.questSteps.getByIds, {
        questStepIds: [step1Id, step2Id],
      });

      expect(steps).toHaveLength(2);
      expect(steps.map((s) => s?.title)).toContain("Step 1");
      expect(steps.map((s) => s?.title)).toContain("Step 2");
    });

    it("should return empty array when no ids provided", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      const steps = await asUser.query(api.questSteps.getByIds, {});
      expect(steps).toEqual([]);
    });
  });

  describe("update", () => {
    it("should update quest step fields", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

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

      const questStepId = await asUser.mutation(api.questSteps.create, {
        questId,
        title: "Original Title",
        content: "Original Content",
      });

      await asUser.mutation(api.questSteps.update, {
        questStepId,
        title: "Updated Title",
        content: "Updated Content",
        button: {
          text: "New Button",
          url: "https://example.com/new",
        },
      });

      const updatedStep = await asUser.query(api.questSteps.getById, {
        questStepId,
      });

      expect(updatedStep).toMatchObject({
        title: "Updated Title",
        content: "Updated Content",
        button: {
          text: "New Button",
          url: "https://example.com/new",
        },
      });

      await expectQuestUpdated(t, questId, userId);
    });

    it("should allow partial updates", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

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

      const questStepId = await asUser.mutation(api.questSteps.create, {
        questId,
        title: "Original Title",
        content: "Original Content",
      });

      await asUser.mutation(api.questSteps.update, {
        questStepId,
        title: "Updated Title",
      });

      const updatedStep = await asUser.query(api.questSteps.getById, {
        questStepId,
      });

      expect(updatedStep?.title).toBe("Updated Title");
      expect(updatedStep?.content).toBe("Original Content");
    });
  });
});
