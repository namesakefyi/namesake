import { convexTest } from "convex-test";
import type { TestConvex } from "convex-test";
import { afterEach, describe, expect, it, vi } from "vitest";
import { api } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import schema from "../schema";
import { modules } from "../test.setup";

const expectQuestUpdated = async (
  t: TestConvex<typeof schema>,
  questId: Id<"quests">,
  userId: Id<"users">,
  expectedTime: number,
) => {
  const updatedQuest = await t.run(async (ctx) => {
    return await ctx.db.get(questId);
  });
  expect(updatedQuest?.updatedAt).toBe(expectedTime);
  expect(updatedQuest?.updatedBy).toBe(userId);
};

describe("questFaqs", () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  it("creates a questFaq", async () => {
    const t = convexTest(schema, modules);

    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        email: "test@example.com",
        role: "user",
      });
    });

    const asUser = t.withIdentity({ subject: userId });

    // Create an faq
    const faqId = await asUser.mutation(api.questFaqs.create, {
      question: "How much does the process cost?",
      answer: "It varies.",
    });

    // Verify faq creation
    const faqs = await t.query(api.questFaqs.getByIds, {
      questFaqIds: [faqId],
    });
    expect(faqs.length).toBe(1);
    expect(faqs[0]?.question).toBe("How much does the process cost?");
    expect(faqs[0]?.answer).toBe("It varies.");
  });

  it("updates an faq", async () => {
    const t = convexTest(schema, modules);

    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        email: "test@example.com",
        role: "user",
      });
    });

    const asUser = t.withIdentity({ subject: userId });

    // Create an faq
    const faqId = await asUser.mutation(api.questFaqs.create, {
      question: "How much does the process cost?",
      answer: "It varies.",
    });

    // Update the faq
    await asUser.mutation(api.questFaqs.update, {
      questFaqId: faqId,
      question: "How much does the process cost, exactly?",
      answer: "It varies a lot.",
    });

    // Verify faq update
    const faqs = await t.query(api.questFaqs.getByIds, {
      questFaqIds: [faqId],
    });
    expect(faqs.length).toBe(1);
    expect(faqs[0]?.question).toBe("How much does the process cost, exactly?");
    expect(faqs[0]?.answer).toBe("It varies a lot.");
  });

  it("deletes a questFaq and removes it from associated quest", async () => {
    const INITIAL_QUEST_UPDATE_TIMESTAMP = new Date("1966-08-01").getTime();
    const DELETION_UPDATE_TIMESTAMP = new Date("1966-08-02").getTime();

    const t = convexTest(schema, modules);

    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        email: "test@example.com",
        role: "user",
      });
    });

    const asUser = t.withIdentity({ subject: userId });

    // Create a quest
    const questId = await t.run(async (ctx) => {
      return await ctx.db.insert("quests", {
        title: "Test Quest",
        slug: "test-quest",
        category: "Test Category",
        jurisdiction: "Test Jurisdiction",
        creationUser: userId,
        updatedAt: INITIAL_QUEST_UPDATE_TIMESTAMP,
      });
    });

    // Set first time before creating the association
    vi.setSystemTime(INITIAL_QUEST_UPDATE_TIMESTAMP);

    // Create an FAQ
    const faqId = await asUser.mutation(api.questFaqs.create, {
      question: "How much does the process cost?",
      answer: "It varies.",
    });

    // Associate FAQ with quest
    await asUser.mutation(api.quests.addFaqId, {
      questId: questId,
      questFaqId: faqId,
    });

    // Verify first update
    await expectQuestUpdated(
      t,
      questId,
      userId,
      INITIAL_QUEST_UPDATE_TIMESTAMP,
    );

    // Set second time before deletion
    vi.setSystemTime(DELETION_UPDATE_TIMESTAMP);

    // Delete the FAQ
    await asUser.mutation(api.questFaqs.deleteForever, {
      questFaqId: faqId,
    });

    // Verify FAQ is deleted
    const faqs = await t.query(api.questFaqs.getByIds, {
      questFaqIds: [faqId],
    });
    expect(faqs.length).toBe(0);

    // Verify quest was updated
    await expectQuestUpdated(t, questId, userId, DELETION_UPDATE_TIMESTAMP);

    // Verify FAQ is removed from quest
    const quest = await t.run(async (ctx) => {
      return await ctx.db.get(questId);
    });
    expect(quest?.faqs).toEqual([]);
  });
});
