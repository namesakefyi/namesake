import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

describe("faqTopics", () => {
  it("creates a topic", async () => {
    const t = convexTest(schema, modules);
    // Create a topic
    const topicId = await t.mutation(api.faqTopics.create, {
      title: "Immigration",
    });

    // Verify topic creation
    const topics = await t.query(api.faqTopics.getAll);
    const createdTopic = topics.find((t) => t._id === topicId);
    expect(createdTopic).toBeTruthy();
    expect(createdTopic?.title).toBe("Immigration");
  });

  it("updates a topic", async () => {
    const t = convexTest(schema, modules);
    // Create a topic
    const topicId = await t.mutation(api.faqTopics.create, {
      title: "Immigration",
    });

    // Update the topic
    await t.mutation(api.faqTopics.set, {
      topicId,
      title: "Adoption",
    });

    // Verify topic update
    const topics = await t.query(api.faqTopics.getAll);
    const updatedTopic = topics.find((t) => t._id === topicId);
    expect(updatedTopic).toBeTruthy();
    expect(updatedTopic?.title).toBe("Adoption");
  });

  it("deletes a topic", async () => {
    const t = convexTest(schema, modules);
    // Create a topic
    const topicId = await t.mutation(api.faqTopics.create, {
      title: "Immigration",
    });

    // Verify topic creation
    const topics = await t.query(api.faqTopics.getAll);
    const createdTopic = topics.find((t) => t._id === topicId);
    expect(createdTopic).toBeTruthy();
    expect(createdTopic?.title).toBe("Immigration");

    // Delete the topic
    await t.mutation(api.faqTopics.deleteForever, {
      topicId,
    });

    // Verify topic deletion
    const topicsAfter = await t.query(api.faqTopics.getAll);
    const deletedTopic = topicsAfter.find((t) => t._id === topicId);
    expect(deletedTopic).toBeUndefined();
  });

  it("gets all topics", async () => {
    const t = convexTest(schema, modules);

    // Mock topics
    await t.run(async (ctx) => {
      await ctx.db.insert("faqTopics", { title: "Immigration" });
      await ctx.db.insert("faqTopics", { title: "Adoption" });
      await ctx.db.insert("faqTopics", { title: "Costs" });
    });

    // Get all topics
    const topics = await t.query(api.faqTopics.getAll);

    // Verify topics
    expect(topics.length).toBe(3);
    expect(topics[0].title).toBe("Immigration");
    expect(topics[1].title).toBe("Adoption");
    expect(topics[2].title).toBe("Costs");
  });

  it("errors if attempting to delete a topic with faqs", async () => {
    const t = convexTest(schema, modules);

    // Create a topic first
    const topicId = await t.mutation(api.faqTopics.create, {
      title: "Costs",
    });

    // Create an faq
    await t.mutation(api.faqs.create, {
      question: "How much does the process cost?",
      answer: "It varies.",
      topics: [topicId],
    });

    // Attempt to delete the topic
    await expect(
      t.mutation(api.faqTopics.deleteForever, {
        topicId,
      }),
    ).rejects.toThrowError("Cannot delete topic attached to existing faqs");
  });
});
