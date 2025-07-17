import { convexTest } from "convex-test";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import schema from "../schema";
import { modules } from "../test.setup";
import { createTestAdmin, createTestUser } from "./helpers";

const UPDATE_TIMESTAMP = 662585400000;

describe("quests", () => {
  beforeEach(() => {
    vi.setSystemTime(UPDATE_TIMESTAMP);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("count", () => {
    it("should return the total number of quests", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

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

      const count = await asUser.query(api.quests.count, {});
      expect(count).toBe(2);
    });
  });

  describe("getAll", () => {
    it("should return all quests", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

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

  describe("getAllInCategory", () => {
    it("should return quests in a specific category", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      await t.run(async (ctx) => {
        await ctx.db.insert("quests", {
          title: "Education Quest",
          slug: "education-quest",
          category: "education",
          jurisdiction: "MA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        await ctx.db.insert("quests", {
          title: "Housing Quest",
          slug: "housing-quest",
          category: "housing",
          jurisdiction: "NY",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });
      });

      const quests = await asUser.query(api.quests.getAllInCategory, {
        category: "education",
      });
      expect(quests).toHaveLength(1);
      expect(quests[0].title).toBe("Education Quest");
    });
  });

  describe("getAllActive", () => {
    it("should only return non-deleted quests", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

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

  describe("getRelevantActive", () => {
    it("should return all quests when user has no quests", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      await t.run(async (ctx) => {
        await ctx.db.insert("quests", {
          title: "Court Order MA",
          slug: "court-order-ma",
          category: "courtOrder",
          jurisdiction: "MA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        await ctx.db.insert("quests", {
          title: "Birth Certificate NY",
          slug: "birth-certificate-ny",
          category: "birthCertificate",
          jurisdiction: "NY",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        await ctx.db.insert("quests", {
          title: "Education Quest",
          slug: "education-quest",
          category: "education",
          jurisdiction: "CA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });
      });

      const quests = await asUser.query(api.quests.getRelevantActive, {});
      expect(quests).toHaveLength(3);
      expect(quests.map((q) => q.title)).toContain("Court Order MA");
      expect(quests.map((q) => q.title)).toContain("Birth Certificate NY");
      expect(quests.map((q) => q.title)).toContain("Education Quest");
    });

    it("should filter out other court orders when user has a court order", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      let courtOrderMAId: Id<"quests">;

      await t.run(async (ctx) => {
        courtOrderMAId = await ctx.db.insert("quests", {
          title: "Court Order MA",
          slug: "court-order-ma",
          category: "courtOrder",
          jurisdiction: "MA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        await ctx.db.insert("quests", {
          title: "Court Order NY",
          slug: "court-order-ny",
          category: "courtOrder",
          jurisdiction: "NY",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        await ctx.db.insert("quests", {
          title: "Education Quest",
          slug: "education-quest",
          category: "education",
          jurisdiction: "CA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        // User adds MA court order to their quests
        await ctx.db.insert("userQuests", {
          userId,
          questId: courtOrderMAId,
          status: "notStarted",
        });
      });

      const quests = await asUser.query(api.quests.getRelevantActive, {});
      expect(quests).toHaveLength(2);
      expect(quests.map((q) => q.title)).toContain("Court Order MA");
      expect(quests.map((q) => q.title)).toContain("Education Quest");
      expect(quests.map((q) => q.title)).not.toContain("Court Order NY");
    });

    it("should filter out other birth certificates when user has a birth certificate", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      let birthCertMAId: Id<"quests">;

      await t.run(async (ctx) => {
        birthCertMAId = await ctx.db.insert("quests", {
          title: "Birth Certificate MA",
          slug: "birth-certificate-ma",
          category: "birthCertificate",
          jurisdiction: "MA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        await ctx.db.insert("quests", {
          title: "Birth Certificate NY",
          slug: "birth-certificate-ny",
          category: "birthCertificate",
          jurisdiction: "NY",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        await ctx.db.insert("quests", {
          title: "Housing Quest",
          slug: "housing-quest",
          category: "housing",
          jurisdiction: "CA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        // User adds MA birth certificate to their quests
        await ctx.db.insert("userQuests", {
          userId,
          questId: birthCertMAId,
          status: "notStarted",
        });
      });

      const quests = await asUser.query(api.quests.getRelevantActive, {});
      expect(quests).toHaveLength(2);
      expect(quests.map((q) => q.title)).toContain("Birth Certificate MA");
      expect(quests.map((q) => q.title)).toContain("Housing Quest");
      expect(quests.map((q) => q.title)).not.toContain("Birth Certificate NY");
    });

    it("should filter out other state IDs when user has a state ID", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      let stateIdMAId: Id<"quests">;

      await t.run(async (ctx) => {
        stateIdMAId = await ctx.db.insert("quests", {
          title: "State ID MA",
          slug: "state-id-ma",
          category: "stateId",
          jurisdiction: "MA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        await ctx.db.insert("quests", {
          title: "State ID NY",
          slug: "state-id-ny",
          category: "stateId",
          jurisdiction: "NY",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        await ctx.db.insert("quests", {
          title: "Finance Quest",
          slug: "finance-quest",
          category: "finance",
          jurisdiction: "CA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        // User adds MA state ID to their quests
        await ctx.db.insert("userQuests", {
          userId,
          questId: stateIdMAId,
          status: "notStarted",
        });
      });

      const quests = await asUser.query(api.quests.getRelevantActive, {});
      expect(quests).toHaveLength(2);
      expect(quests.map((q) => q.title)).toContain("State ID MA");
      expect(quests.map((q) => q.title)).toContain("Finance Quest");
      expect(quests.map((q) => q.title)).not.toContain("State ID NY");
    });

    it("should show all quests in non-filterable categories regardless of user quests", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      let educationQuestId: Id<"quests">;

      await t.run(async (ctx) => {
        educationQuestId = await ctx.db.insert("quests", {
          title: "Education Quest 1",
          slug: "education-quest-1",
          category: "education",
          jurisdiction: "MA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        await ctx.db.insert("quests", {
          title: "Housing Quest 1",
          slug: "housing-quest-1",
          category: "housing",
          jurisdiction: "NY",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        await ctx.db.insert("quests", {
          title: "Education Quest 2",
          slug: "education-quest-2",
          category: "education",
          jurisdiction: "CA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        await ctx.db.insert("quests", {
          title: "Housing Quest 2",
          slug: "housing-quest-2",
          category: "housing",
          jurisdiction: "TX",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        // User adds one education quest to their quests
        await ctx.db.insert("userQuests", {
          userId,
          questId: educationQuestId,
          status: "notStarted",
        });
      });

      const quests = await asUser.query(api.quests.getRelevantActive, {});
      expect(quests).toHaveLength(4);
      expect(quests.map((q) => q.title)).toContain("Education Quest 1");
      expect(quests.map((q) => q.title)).toContain("Education Quest 2");
      expect(quests.map((q) => q.title)).toContain("Housing Quest 1");
      expect(quests.map((q) => q.title)).toContain("Housing Quest 2");
    });

    it("should handle multiple filterable categories correctly", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      let courtOrderMAId: Id<"quests">;
      let birthCertNYId: Id<"quests">;
      let stateIdCAId: Id<"quests">;

      await t.run(async (ctx) => {
        courtOrderMAId = await ctx.db.insert("quests", {
          title: "Court Order MA",
          slug: "court-order-ma",
          category: "courtOrder",
          jurisdiction: "MA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        birthCertNYId = await ctx.db.insert("quests", {
          title: "Birth Certificate NY",
          slug: "birth-certificate-ny",
          category: "birthCertificate",
          jurisdiction: "NY",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        stateIdCAId = await ctx.db.insert("quests", {
          title: "State ID CA",
          slug: "state-id-ca",
          category: "stateId",
          jurisdiction: "CA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        // Add other quests in same categories
        await ctx.db.insert("quests", {
          title: "Court Order NY",
          slug: "court-order-ny",
          category: "courtOrder",
          jurisdiction: "NY",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        await ctx.db.insert("quests", {
          title: "Birth Certificate MA",
          slug: "birth-certificate-ma",
          category: "birthCertificate",
          jurisdiction: "MA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        await ctx.db.insert("quests", {
          title: "State ID TX",
          slug: "state-id-tx",
          category: "stateId",
          jurisdiction: "TX",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        await ctx.db.insert("quests", {
          title: "Education Quest",
          slug: "education-quest",
          category: "education",
          jurisdiction: "FL",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        // User adds one quest from each filterable category
        await ctx.db.insert("userQuests", {
          userId,
          questId: courtOrderMAId,
          status: "notStarted",
        });

        await ctx.db.insert("userQuests", {
          userId,
          questId: birthCertNYId,
          status: "notStarted",
        });

        await ctx.db.insert("userQuests", {
          userId,
          questId: stateIdCAId,
          status: "notStarted",
        });
      });

      const quests = await asUser.query(api.quests.getRelevantActive, {});
      expect(quests).toHaveLength(4);
      expect(quests.map((q) => q.title)).toContain("Court Order MA");
      expect(quests.map((q) => q.title)).toContain("Birth Certificate NY");
      expect(quests.map((q) => q.title)).toContain("State ID CA");
      expect(quests.map((q) => q.title)).toContain("Education Quest");
      expect(quests.map((q) => q.title)).not.toContain("Court Order NY");
      expect(quests.map((q) => q.title)).not.toContain("Birth Certificate MA");
      expect(quests.map((q) => q.title)).not.toContain("State ID TX");
    });
  });

  describe("getWithUserQuest", () => {
    it("should return quest with associated user quest data", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      await t.run(async (ctx) => {
        const questId = await ctx.db.insert("quests", {
          title: "Test Quest",
          slug: "test-quest",
          category: "education",
          jurisdiction: "MA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });

        await ctx.db.insert("userQuests", {
          userId,
          questId,
          status: "notStarted",
        });
      });

      const quest = await asUser.query(api.quests.getWithUserQuest, {
        slug: "test-quest",
      });
      expect(quest).not.toBeNull();
      expect(quest?.quest?.title).toBe("Test Quest");
      expect(quest?.userQuest).toBeDefined();
      expect(quest?.userQuest?.status).toBe("notStarted");
    });
  });

  describe("getByCategoryAndJurisdiction", () => {
    it("should return quest matching category and jurisdiction", async () => {
      const t = convexTest(schema, modules);
      const { asAdmin } = await createTestAdmin(t);

      await asAdmin.mutation(api.quests.create, {
        title: "Court Order Quest",
        category: "courtOrder",
        jurisdiction: "MA",
      });

      const { asUser } = await createTestUser(t);

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
      const { asUser } = await createTestUser(t);

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

  describe("getById", () => {
    it("should return a quest by its ID", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      const questId = await t.run(async (ctx) => {
        return await ctx.db.insert("quests", {
          title: "Test Quest",
          slug: "test-quest",
          category: "education",
          jurisdiction: "MA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });
      });

      const quest = await asUser.query(api.quests.getById, { questId });
      expect(quest).not.toBeNull();
      expect(quest?.title).toBe("Test Quest");
    });
  });

  describe("getBySlug", () => {
    it("should return a quest by its slug", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      await t.run(async (ctx) => {
        await ctx.db.insert("quests", {
          title: "Test Quest",
          slug: "test-quest",
          category: "education",
          jurisdiction: "MA",
          creationUser: userId,
          updatedAt: UPDATE_TIMESTAMP,
        });
      });

      const quest = await asUser.query(api.quests.getBySlug, {
        slug: "test-quest",
      });
      expect(quest).not.toBeNull();
      expect(quest?.title).toBe("Test Quest");
    });
  });

  describe("create", () => {
    it("should create a quest with required fields", async () => {
      const t = convexTest(schema, modules);
      const { asAdmin, adminId } = await createTestAdmin(t);

      const { questId, slug } = await asAdmin.mutation(api.quests.create, {
        title: "New Quest",
        category: "education",
        jurisdiction: "MA",
      });

      const quest = await asAdmin.query(api.quests.getById, { questId });

      expect(quest).not.toBeNull();
      expect(quest?.title).toBe("New Quest");
      expect(quest?.category).toBe("education");
      expect(quest?.jurisdiction).toBe("MA");
      expect(quest?.slug).toBe(slug);
      expect(quest?.creationUser).toBe(adminId);
      expect(quest?.updatedAt).toBe(UPDATE_TIMESTAMP);
      expect(quest?.updatedBy).toBe(adminId);
    });

    it("should generate unique slugs for duplicate titles", async () => {
      const t = convexTest(schema, modules);
      const { asAdmin } = await createTestAdmin(t);

      const quest1 = await asAdmin.mutation(api.quests.create, {
        title: "Same Title",
        category: "education",
        jurisdiction: "MA",
      });

      const quest2 = await asAdmin.mutation(api.quests.create, {
        title: "Same Title",
        category: "education",
        jurisdiction: "MA",
      });

      expect(quest1.slug).not.toBe(quest2.slug);
    });
  });

  describe("setTitle", () => {
    it("should update a quest's title", async () => {
      const t = convexTest(schema, modules);
      const { asAdmin } = await createTestAdmin(t);

      const { questId } = await asAdmin.mutation(api.quests.create, {
        title: "Original Title",
        category: "education",
        jurisdiction: "MA",
      });

      await asAdmin.mutation(api.quests.setTitle, {
        questId,
        title: "Updated Title",
      });

      const quest = await asAdmin.query(api.quests.getById, { questId });
      expect(quest?.title).toBe("Updated Title");
    });
  });

  describe("setJurisdiction", () => {
    it("should update a quest's jurisdiction", async () => {
      const t = convexTest(schema, modules);
      const { asAdmin } = await createTestAdmin(t);

      const { questId } = await asAdmin.mutation(api.quests.create, {
        title: "Test Quest",
        category: "education",
        jurisdiction: "MA",
      });

      await asAdmin.mutation(api.quests.setJurisdiction, {
        questId,
        jurisdiction: "NY",
      });

      const quest = await asAdmin.query(api.quests.getById, { questId });
      expect(quest?.jurisdiction).toBe("NY");
    });
  });

  describe("setCategory", () => {
    it("should update a quest's category", async () => {
      const t = convexTest(schema, modules);
      const { asAdmin } = await createTestAdmin(t);

      const { questId } = await asAdmin.mutation(api.quests.create, {
        title: "Test Quest",
        category: "education",
        jurisdiction: "MA",
      });

      await asAdmin.mutation(api.quests.setCategory, {
        questId,
        category: "housing",
      });

      const quest = await asAdmin.query(api.quests.getById, { questId });
      expect(quest?.category).toBe("housing");
    });
  });

  describe("setCosts", () => {
    it("should update a quest's costs", async () => {
      const t = convexTest(schema, modules);
      const { asAdmin } = await createTestAdmin(t);

      const { questId } = await asAdmin.mutation(api.quests.create, {
        title: "Test Quest",
        category: "education",
        jurisdiction: "MA",
      });

      const costs = [
        { cost: 50, description: "Application Fee", isRequired: true },
        { cost: 25, description: "Processing Fee", isRequired: false },
      ];

      await asAdmin.mutation(api.quests.setCosts, {
        questId,
        costs,
      });

      const quest = await asAdmin.query(api.quests.getById, { questId });
      expect(quest?.costs).toEqual(costs);
    });
  });

  describe("setTimeRequired", () => {
    it("should update a quest's time required", async () => {
      const t = convexTest(schema, modules);
      const { asAdmin } = await createTestAdmin(t);

      const { questId } = await asAdmin.mutation(api.quests.create, {
        title: "Test Quest",
        category: "education",
        jurisdiction: "MA",
      });

      const timeRequired = {
        min: 1,
        max: 2,
        unit: "weeks",
        description: "Processing time",
      };

      await asAdmin.mutation(api.quests.setTimeRequired, {
        questId,
        timeRequired,
      });

      const quest = await asAdmin.query(api.quests.getById, { questId });
      expect(quest?.timeRequired).toEqual(timeRequired);
    });
  });

  describe("setContent", () => {
    it("should update a quest's content", async () => {
      const t = convexTest(schema, modules);
      const { asAdmin } = await createTestAdmin(t);

      const { questId } = await asAdmin.mutation(api.quests.create, {
        title: "Test Quest",
        category: "education",
        jurisdiction: "MA",
      });

      const content = "This is the updated content for the quest.";

      await asAdmin.mutation(api.quests.setContent, {
        questId,
        content,
      });

      const quest = await asAdmin.query(api.quests.getById, { questId });
      expect(quest?.content).toBe(content);
    });
  });

  describe("softDelete", () => {
    it("should mark a quest as deleted", async () => {
      const t = convexTest(schema, modules);
      const { asAdmin, adminId } = await createTestAdmin(t);

      const { questId } = await asAdmin.mutation(api.quests.create, {
        title: "To Delete",
        category: "education",
        jurisdiction: "MA",
      });

      await asAdmin.mutation(api.quests.softDelete, { questId });

      const quest = await asAdmin.query(api.quests.getById, { questId });
      expect(quest?.deletedAt).toBeDefined();
      expect(typeof quest?.deletedAt).toBe("number");
      expect(quest?.updatedAt).toBe(UPDATE_TIMESTAMP);
      expect(quest?.updatedBy).toBe(adminId);
    });

    it("should be reversible", async () => {
      const t = convexTest(schema, modules);
      const { asAdmin, adminId } = await createTestAdmin(t);

      const { questId } = await asAdmin.mutation(api.quests.create, {
        title: "To Restore",
        category: "education",
        jurisdiction: "MA",
      });

      await asAdmin.mutation(api.quests.softDelete, { questId });
      await asAdmin.mutation(api.quests.undoSoftDelete, { questId });

      const quest = await asAdmin.query(api.quests.getById, { questId });
      expect(quest?.deletedAt).toBeUndefined();
      expect(quest?.updatedAt).toBe(UPDATE_TIMESTAMP);
      expect(quest?.updatedBy).toBe(adminId);
    });
  });

  describe("deleteForever", () => {
    it("should permanently delete a quest and its associated userQuests", async () => {
      const t = convexTest(schema, modules);
      const { asAdmin, adminId } = await createTestAdmin(t);

      const { questId } = await asAdmin.mutation(api.quests.create, {
        title: "To Delete Forever",
        category: "education",
        jurisdiction: "MA",
      });

      // Create a userQuest
      await t.run(async (ctx) => {
        await ctx.db.insert("userQuests", {
          userId: adminId,
          questId,
          status: "notStarted",
        });
      });

      await asAdmin.mutation(api.quests.deleteForever, { questId });

      const quest = await asAdmin.query(api.quests.getById, { questId });
      expect(quest).toBeNull();

      // Verify userQuest is also deleted
      const userQuest = await asAdmin.query(api.userQuests.getByQuestId, {
        questId,
      });
      expect(userQuest).toBeNull();
    });
  });
});
