import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

describe("faqs", () => {
  it("creates an faq", async () => {
    const t = convexTest(schema, modules);

    // Create an faq
    const faqId = await t.mutation(api.faqs.create, {
      question: "How much does the process cost?",
      answer: "It varies.",
    });

    // Verify faq creation
    const faqs = await t.query(api.faqs.getAll);
    const createdFaq = faqs.find((f) => f._id === faqId);
    expect(createdFaq).toBeTruthy();
    expect(createdFaq?.question).toBe("How much does the process cost?");
    expect(createdFaq?.answer).toBe("It varies.");
  });

  it("updates an faq", async () => {
    const t = convexTest(schema, modules);

    // Create an faq
    const faqId = await t.mutation(api.faqs.create, {
      question: "How much does the process cost?",
      answer: "It varies.",
    });

    // Update the faq
    await t.mutation(api.faqs.update, {
      faqId,
      question: {
        question: "How much does the process cost, exactly?",
        answer: "It varies a lot.",
      },
    });

    // Verify faq update
    const faqs = await t.query(api.faqs.getAll);
    const updatedFaq = faqs.find((f) => f._id === faqId);
    expect(updatedFaq).toBeTruthy();
    expect(updatedFaq?.question).toBe(
      "How much does the process cost, exactly?",
    );
    expect(updatedFaq?.answer).toBe("It varies a lot.");
  });

  it("gets all faqs", async () => {
    const t = convexTest(schema, modules);

    // Create a user
    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        role: "user",
        emailVerified: true,
      });
    });

    // Mock faqs
    await t.run(async (ctx) => {
      await ctx.db.insert("faqs", {
        question: "How much does the process cost?",
        answer: "It varies.",
        creationUser: userId,
        updatedAt: Date.now(),
      });
      await ctx.db.insert("faqs", {
        question: "What documents do I need?",
        answer: "You'll need passport, visa, and other supporting documents.",
        creationUser: userId,
        updatedAt: Date.now(),
      });
    });

    // Get all faqs
    const faqs = await t.query(api.faqs.getAll);

    // Verify faqs
    expect(faqs.length).toBe(2);
    expect(faqs[0].question).toBe("How much does the process cost?");
    expect(faqs[1].question).toBe("What documents do I need?");
  });

  it("deletes a faq", async () => {
    const t = convexTest(schema, modules);
    // Create a question
    const faqId = await t.mutation(api.faqs.create, {
      question: "How much does the process cost?",
      answer: "It varies.",
    });

    // Verify faq creation
    const faqs = await t.query(api.faqs.getAll);
    const createdFaq = faqs.find((f) => f._id === faqId);
    expect(createdFaq).toBeTruthy();
    expect(createdFaq?.question).toBe("How much does the process cost?");
    expect(createdFaq?.answer).toBe("It varies.");

    // Delete the faq
    await t.mutation(api.faqs.deleteForever, {
      faqId,
    });

    // Verify faq deletion
    const faqsAfter = await t.query(api.faqs.getAll);
    const deletedFaq = faqsAfter.find((f) => f._id === faqId);
    expect(deletedFaq).toBeUndefined();
  });
});
