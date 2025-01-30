import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

describe("questFaqs", () => {
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

  it("deletes a questFaq", async () => {
    const t = convexTest(schema, modules);

    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        email: "test@example.com",
        role: "user",
      });
    });

    const asUser = t.withIdentity({ subject: userId });

    // Create a question
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

    // Delete the faq
    await asUser.mutation(api.questFaqs.deleteForever, {
      questFaqId: faqId,
    });

    // Verify faq deletion
    const faqsAfter = await t.query(api.questFaqs.getByIds, {
      questFaqIds: [faqId],
    });
    expect(faqsAfter.length).toBe(0);
  });
});
