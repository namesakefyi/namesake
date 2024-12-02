import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

describe("faqs", () => {
  it("creates a FAQ", async () => {
    const t = convexTest(schema, modules);

    // Create a topic first
    const topicId = await t.mutation(api.topics.createTopic, {
      topic: "Costs",
    });

    // Create a FAQ
    const faqId = await t.mutation(api.faqs.createFAQ, {
      question: "How much does the process cost?",
      answer: "It varies.",
      topics: [topicId],
    });

    // Verify FAQ creation
    const faqs = await t.query(api.faqs.getAllFAQs);
    const createdFAQ = faqs.find((f) => f._id === faqId);
    expect(createdFAQ).toBeTruthy();
    expect(createdFAQ?.question).toBe("How much does the process cost?");
    expect(createdFAQ?.answer).toBe("It varies.");
    expect(createdFAQ?.topics).toContain(topicId);
  });

  it("updates a FAQ", async () => {
    const t = convexTest(schema, modules);

    // Create a topic first
    const topicId = await t.mutation(api.topics.createTopic, {
      topic: "Costs",
    });

    // Create a FAQ
    const faqId = await t.mutation(api.faqs.createFAQ, {
      question: "How much does the process cost?",
      answer: "It varies.",
      topics: [topicId],
    });

    // Update the FAQ
    await t.mutation(api.faqs.updateFAQ, {
      faqId,
      faq: {
        question: "How much does the process cost, exactly?",
        answer: "It varies a lot.",
        topics: [topicId],
      },
    });

    // Verify FAQ update
    const faqs = await t.query(api.faqs.getAllFAQs);
    const updatedFAQ = faqs.find((f) => f._id === faqId);
    expect(updatedFAQ).toBeTruthy();
    expect(updatedFAQ?.question).toBe(
      "How much does the process cost, exactly?",
    );
    expect(updatedFAQ?.answer).toBe("It varies a lot.");
  });

  it("gets all FAQs", async () => {
    const t = convexTest(schema, modules);

    // Create a topic first
    const topicId = await t.mutation(api.topics.createTopic, {
      topic: "Costs",
    });

    // Mock FAQs
    await t.run(async (ctx) => {
      await ctx.db.insert("faqs", {
        question: "How much does the process cost?",
        answer: "It varies.",
        topics: [topicId],
      });
      await ctx.db.insert("faqs", {
        question: "What documents do I need?",
        answer: "You'll need passport, visa, and other supporting documents.",
        topics: [topicId],
      });
    });

    // Get all FAQs
    const faqs = await t.query(api.faqs.getAllFAQs);

    // Verify FAQs
    expect(faqs.length).toBe(2);
    expect(faqs[0].question).toBe("How much does the process cost?");
    expect(faqs[1].question).toBe("What documents do I need?");
  });

  it("deletes a FAQ", async () => {
    const t = convexTest(schema, modules);

    // Create a topic first
    const topicId = await t.mutation(api.topics.createTopic, {
      topic: "Costs",
    });

    // Create a FAQ
    const faqId = await t.mutation(api.faqs.createFAQ, {
      question: "How much does the process cost?",
      answer: "It varies.",
      topics: [topicId],
    });

    // Verify FAQ creation
    const faqs = await t.query(api.faqs.getAllFAQs);
    const createdFAQ = faqs.find((f) => f._id === faqId);
    expect(createdFAQ).toBeTruthy();
    expect(createdFAQ?.question).toBe("How much does the process cost?");
    expect(createdFAQ?.answer).toBe("It varies.");
    expect(createdFAQ?.topics).toContain(topicId);

    // Delete the FAQ
    await t.mutation(api.faqs.deleteFAQ, {
      faqId,
    });

    // Verify FAQ deletion
    const faqsAfter = await t.query(api.faqs.getAllFAQs);
    const deletedFAQ = faqsAfter.find((f) => f._id === faqId);
    expect(deletedFAQ).toBeUndefined();
  });

  it("errors if attempting to delete an faq with related quests", async () => {
    const t = convexTest(schema, modules);

    // Create a topic first
    const topicId = await t.mutation(api.topics.createTopic, {
      topic: "Costs",
    });

    // Create a user
    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        role: "user",
        emailVerified: true,
      });
    });

    // Create a quest
    const questId = await t.run(async (ctx) => {
      return await ctx.db.insert("quests", {
        title: "Court Order",
        creationUser: userId,
      });
    });

    // Create a FAQ
    const faqId = await t.mutation(api.faqs.createFAQ, {
      question: "How much does the process cost?",
      answer: "It varies.",
      topics: [topicId],
      relatedQuests: [questId],
    });

    // Attempt to delete the faq
    await expect(
      t.mutation(api.faqs.deleteFAQ, {
        faqId,
      }),
    ).rejects.toThrowError(
      "There are related quests for this question. Please delete them first.",
    );
  });
});
