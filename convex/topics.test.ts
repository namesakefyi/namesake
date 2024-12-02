import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

describe("topics", () => {
  it("creates a topic", async () => {
    const t = convexTest(schema, modules);
    // Create a topic
    const topicId = await t.mutation(api.topics.createTopic, {
      topic: "Immigration",
    });

    // Verify topic creation
    const topics = await t.query(api.topics.getAllTopics);
    const createdTopic = topics.find((t) => t._id === topicId);
    expect(createdTopic).toBeTruthy();
    expect(createdTopic?.topic).toBe("Immigration");
  });

  it("updates a topic", async () => {
    const t = convexTest(schema, modules);
    // Create a topic
    const topicId = await t.mutation(api.topics.createTopic, {
      topic: "Immigration",
    });

    // Update the topic
    await t.mutation(api.topics.updateTopic, {
      topicId,
      topic: "Adoption",
    });

    // Verify topic update
    const topics = await t.query(api.topics.getAllTopics);
    const updatedTopic = topics.find((t) => t._id === topicId);
    expect(updatedTopic).toBeTruthy();
    expect(updatedTopic?.topic).toBe("Adoption");
  });

  it("deletes a topic", async () => {
    const t = convexTest(schema, modules);
    // Create a topic
    const topicId = await t.mutation(api.topics.createTopic, {
      topic: "Immigration",
    });

    // Verify topic creation
    const topics = await t.query(api.topics.getAllTopics);
    const createdTopic = topics.find((t) => t._id === topicId);
    expect(createdTopic).toBeTruthy();
    expect(createdTopic?.topic).toBe("Immigration");

    // Delete the topic
    await t.mutation(api.topics.deleteTopic, {
      topicId,
    });

    // Verify topic deletion
    const topicsAfter = await t.query(api.topics.getAllTopics);
    const deletedTopic = topicsAfter.find((t) => t._id === topicId);
    expect(deletedTopic).toBeUndefined();
  });

  it("gets all topics", async () => {
    const t = convexTest(schema, modules);

    // Mock topics
    await t.run(async (ctx) => {
      await ctx.db.insert("topics", { topic: "Immigration" });
      await ctx.db.insert("topics", { topic: "Adoption" });
      await ctx.db.insert("topics", { topic: "Costs" });
    });

    // Get all topics
    const topics = await t.query(api.topics.getAllTopics);

    // Verify topics
    expect(topics.length).toBe(3);
    expect(topics[0].topic).toBe("Immigration");
    expect(topics[1].topic).toBe("Adoption");
    expect(topics[2].topic).toBe("Costs");
  });

  it("errors if attempting to delete a topic with faqs", async () => {
    const t = convexTest(schema, modules);

    // Create a topic first
    const topicId = await t.mutation(api.topics.createTopic, {
      topic: "Costs",
    });

    // Create a FAQ
    await t.mutation(api.faqs.createFAQ, {
      question: "How much does the process cost?",
      answer: "It varies.",
      topics: [topicId],
    });

    // Attempt to delete the topic
    await expect(
      t.mutation(api.topics.deleteTopic, {
        topicId,
      }),
    ).rejects.toThrowError("Cannot delete topic with faqs");
  });
});
