import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

describe("questions", () => {
  it("creates a question", async () => {
    const t = convexTest(schema, modules);

    // Create a topic first
    const topicId = await t.mutation(api.topics.create, {
      topic: "Costs",
    });

    // Create a question
    const questionId = await t.mutation(api.questions.create, {
      question: "How much does the process cost?",
      answer: "It varies.",
      topics: [topicId],
    });

    // Verify question creation
    const questions = await t.query(api.questions.getAll);
    const createdQuestion = questions.find((f) => f._id === questionId);
    expect(createdQuestion).toBeTruthy();
    expect(createdQuestion?.question).toBe("How much does the process cost?");
    expect(createdQuestion?.answer).toBe("It varies.");
    expect(createdQuestion?.topics).toContain(topicId);
  });

  it("updates a question", async () => {
    const t = convexTest(schema, modules);

    // Create a topic first
    const topicId = await t.mutation(api.topics.create, {
      topic: "Costs",
    });

    // Create a question
    const questionId = await t.mutation(api.questions.create, {
      question: "How much does the process cost?",
      answer: "It varies.",
      topics: [topicId],
    });

    // Update the question
    await t.mutation(api.questions.update, {
      questionId,
      question: {
        question: "How much does the process cost, exactly?",
        answer: "It varies a lot.",
        topics: [topicId],
      },
    });

    // Verify question update
    const questions = await t.query(api.questions.getAll);
    const updatedQuestion = questions.find((q) => q._id === questionId);
    expect(updatedQuestion).toBeTruthy();
    expect(updatedQuestion?.question).toBe(
      "How much does the process cost, exactly?",
    );
    expect(updatedQuestion?.answer).toBe("It varies a lot.");
  });

  it("gets all questions", async () => {
    const t = convexTest(schema, modules);

    // Create a topic first
    const topicId = await t.mutation(api.topics.create, {
      topic: "Costs",
    });

    // Mock questions
    await t.run(async (ctx) => {
      await ctx.db.insert("questions", {
        question: "How much does the process cost?",
        answer: "It varies.",
        topics: [topicId],
      });
      await ctx.db.insert("questions", {
        question: "What documents do I need?",
        answer: "You'll need passport, visa, and other supporting documents.",
        topics: [topicId],
      });
    });

    // Get all questions
    const questions = await t.query(api.questions.getAll);

    // Verify questions
    expect(questions.length).toBe(2);
    expect(questions[0].question).toBe("How much does the process cost?");
    expect(questions[1].question).toBe("What documents do I need?");
  });

  it("deletes a question", async () => {
    const t = convexTest(schema, modules);

    // Create a topic first
    const topicId = await t.mutation(api.topics.create, {
      topic: "Costs",
    });

    // Create a question
    const questionId = await t.mutation(api.questions.create, {
      question: "How much does the process cost?",
      answer: "It varies.",
      topics: [topicId],
    });

    // Verify question creation
    const questions = await t.query(api.questions.getAll);
    const createdQuestion = questions.find((q) => q._id === questionId);
    expect(createdQuestion).toBeTruthy();
    expect(createdQuestion?.question).toBe("How much does the process cost?");
    expect(createdQuestion?.answer).toBe("It varies.");
    expect(createdQuestion?.topics).toContain(topicId);

    // Delete the question
    await t.mutation(api.questions.permanentlyDelete, {
      questionId,
    });

    // Verify question deletion
    const questionsAfter = await t.query(api.questions.getAll);
    const deletedQuestion = questionsAfter.find((f) => f._id === questionId);
    expect(deletedQuestion).toBeUndefined();
  });

  it("errors if attempting to delete a question with related quests", async () => {
    const t = convexTest(schema, modules);

    // Create a topic first
    const topicId = await t.mutation(api.topics.create, {
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

    // Create a question
    const questionId = await t.mutation(api.questions.create, {
      question: "How much does the process cost?",
      answer: "It varies.",
      topics: [topicId],
      relatedQuests: [questId],
    });

    // Attempt to delete the question
    await expect(
      t.mutation(api.questions.permanentlyDelete, {
        questionId,
      }),
    ).rejects.toThrowError(
      "There are related quests for this question. Please delete them first.",
    );
  });
});
