import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

describe("forms", () => {
  describe("getAll", () => {
    it("should return all forms", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      await t.run(async (ctx) => {
        // Create forms
        await ctx.db.insert("forms", {
          createdBy: userId,
          pages: [],
        });

        await ctx.db.insert("forms", {
          createdBy: userId,
          pages: [],
        });
      });

      const forms = await asUser.query(api.forms.getAll, {});
      expect(forms).toHaveLength(2);
    });
  });

  describe("getById", () => {
    it("should return a form by its ID", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      const formId = await t.run(async (ctx) => {
        return await ctx.db.insert("forms", {
          createdBy: userId,
          pages: [],
        });
      });

      const form = await asUser.query(api.forms.getById, { formId });
      expect(form).toBeTruthy();
      expect(form?._id).toBe(formId);
    });

    it("should return null for non-existent form", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      const form = await asUser.query(api.forms.getById, { formId: undefined });
      expect(form).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a form for a quest", async () => {
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
          category: "core",
          creationUser: userId,
        });
      });

      const formId = await asUser.mutation(api.forms.create, { questId });

      await t.run(async (ctx) => {
        const quest = await ctx.db.get(questId);
        const form = await ctx.db.get(formId);

        expect(quest?.formId).toBe(formId);
        expect(form?.createdBy).toBe(userId);
        expect(form?.pages).toHaveLength(0);
      });
    });
  });

  describe("update", () => {
    it("should update a form", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      const formId = await t.run(async (ctx) => {
        return await ctx.db.insert("forms", {
          createdBy: userId,
          pages: [],
        });
      });

      await asUser.mutation(api.forms.update, {
        formId,
        pages: [],
      });

      const updatedForm = await asUser.query(api.forms.getById, { formId });
      expect(updatedForm?.updatedBy).toBe(userId);
      expect(updatedForm?.updatedAt).toBeTruthy();
    });
  });

  describe("getByQuestId", () => {
    it("should return form for a given quest", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      const questId = await t.run(async (ctx) => {
        const formId = await ctx.db.insert("forms", {
          createdBy: userId,
          pages: [],
        });

        return await ctx.db.insert("quests", {
          title: "Test Quest",
          category: "core",
          creationUser: userId,
          formId,
        });
      });

      const form = await asUser.query(api.forms.getByQuestId, { questId });
      expect(form).toBeTruthy();
    });

    it("should return null if no form exists for quest", async () => {
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
          category: "core",
          creationUser: userId,
        });
      });

      const form = await asUser.query(api.forms.getByQuestId, { questId });
      expect(form).toBeNull();
    });
  });
});
