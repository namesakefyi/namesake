import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

describe("formPages", () => {
  describe("getAllByFormId", () => {
    it("should return all pages for a given form", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      const formId = await t.run(async (ctx) => {
        const createdFormId = await ctx.db.insert("forms", {
          createdBy: userId,
          pages: [],
        });

        const page1Id = await ctx.db.insert("formPages", {
          formId: createdFormId,
          title: "Page 1",
          fields: [],
        });

        const page2Id = await ctx.db.insert("formPages", {
          formId: createdFormId,
          title: "Page 2",
          fields: [],
        });

        await ctx.db.patch(createdFormId, {
          pages: [page1Id, page2Id],
        });

        return createdFormId;
      });

      const pages = await asUser.query(api.formPages.getAllByFormId, {
        formId,
      });
      expect(pages).toHaveLength(2);
      expect(pages.map((p) => p.title)).toContain("Page 1");
      expect(pages.map((p) => p.title)).toContain("Page 2");
    });

    it("should return an empty array for a form with no pages", async () => {
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

      const pages = await asUser.query(api.formPages.getAllByFormId, {
        formId,
      });
      expect(pages).toHaveLength(0);
    });
  });

  describe("getAllByQuestId", () => {
    it("should return pages for a quest's form", async () => {
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

        const page1Id = await ctx.db.insert("formPages", {
          formId,
          title: "Page 1",
          fields: [],
        });

        const page2Id = await ctx.db.insert("formPages", {
          formId,
          title: "Page 2",
          fields: [],
        });

        await ctx.db.patch(formId, {
          pages: [page1Id, page2Id],
        });

        return await ctx.db.insert("quests", {
          title: "Test Quest",
          category: "core",
          creationUser: userId,
          formId,
        });
      });

      const pages = await asUser.query(api.formPages.getAllByQuestId, {
        questId,
      });
      expect(pages).toHaveLength(2);
      expect(pages?.map((p) => p.title)).toContain("Page 1");
      expect(pages?.map((p) => p.title)).toContain("Page 2");
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

      const pages = await asUser.query(api.formPages.getAllByQuestId, {
        questId,
      });
      expect(pages).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a page for a form", async () => {
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

      const pageId = await asUser.mutation(api.formPages.create, {
        formId,
        title: "New Page",
        description: "Page description",
        fields: [
          {
            type: "text",
            label: "First Name",
            name: "firstName",
            required: true,
          },
        ],
      });

      await t.run(async (ctx) => {
        const form = await ctx.db.get(formId);
        const page = await ctx.db.get(pageId);

        expect(form?.pages).toContain(pageId);
        expect(page?.title).toBe("New Page");
        expect(page?.description).toBe("Page description");
        expect(page?.fields).toHaveLength(1);
        expect(page?.fields?.[0].name).toBe("firstName");
      });
    });

    it("should throw an error for non-existent form", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const formId = await t.run(async (ctx) => {
        return await ctx.db.insert("forms", {
          createdBy: userId,
          pages: [],
        });
      });

      await t.run(async (ctx) => {
        await ctx.db.delete(formId);
      });

      const asUser = t.withIdentity({ subject: userId });

      await expect(
        asUser.mutation(api.formPages.create, {
          formId,
          title: "New Page",
        }),
      ).rejects.toThrow("Form not found");
    });
  });

  describe("update", () => {
    it("should update a page", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      const pageId = await t.run(async (ctx) => {
        const formId = await ctx.db.insert("forms", {
          createdBy: userId,
          pages: [],
        });

        return await ctx.db.insert("formPages", {
          formId,
          title: "Original Page",
          fields: [],
        });
      });

      await asUser.mutation(api.formPages.update, {
        pageId,
        title: "Updated Page",
        fields: [
          {
            type: "text",
            label: "First Name",
            name: "firstName",
            required: true,
          },
        ],
      });

      const updatedPage = await t.run(async (ctx) => {
        return await ctx.db.get(pageId);
      });

      expect(updatedPage?.title).toBe("Updated Page");
      expect(updatedPage?.fields).toHaveLength(1);
      expect(updatedPage?.fields?.[0].name).toBe("firstName");
    });

    it("should update updatedBy and updatedAt values for form", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      const { formId, pageId } = await t.run(async (ctx) => {
        const createdFormId = await ctx.db.insert("forms", {
          createdBy: userId,
          pages: [],
        });

        const createdPageId = await ctx.db.insert("formPages", {
          formId: createdFormId,
          title: "Original Page",
          fields: [],
        });

        return { formId: createdFormId, pageId: createdPageId };
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      await asUser.mutation(api.formPages.update, {
        pageId,
        title: "Updated Page",
        fields: [
          {
            type: "text",
            label: "First Name",
            name: "firstName",
            required: true,
          },
        ],
      });

      const result = await t.run(async (ctx) => {
        const form = await ctx.db.get(formId);
        const page = await ctx.db.get(pageId);

        return { form, page };
      });

      expect(result.page?.title).toBe("Updated Page");
      expect(result.form?.updatedBy).toBe(userId);
      expect(result.form?.updatedAt).toBeTruthy();
    });

    it("should throw an error when updating a non-existent page", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const pageId = await t.run(async (ctx) => {
        const formId = await ctx.db.insert("forms", {
          createdBy: userId,
          pages: [],
        });

        return await ctx.db.insert("formPages", {
          formId,
          title: "Page to Delete",
          fields: [],
        });
      });

      // Delete the page before attempting to update
      await t.run(async (ctx) => {
        await ctx.db.delete(pageId);
      });

      const asUser = t.withIdentity({ subject: userId });

      await expect(
        asUser.mutation(api.formPages.update, {
          pageId,
          title: "Updated Page",
          fields: [
            {
              type: "text",
              label: "First Name",
              name: "firstName",
              required: true,
            },
          ],
        }),
      ).rejects.toThrow("Page not found");
    });
  });

  describe("remove", () => {
    it("should remove a page from a form", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      const { formId, pageId } = await t.run(async (ctx) => {
        const createdFormId = await ctx.db.insert("forms", {
          createdBy: userId,
          pages: [],
        });

        const createdPageId = await ctx.db.insert("formPages", {
          formId: createdFormId,
          title: "Page to Remove",
          fields: [],
        });

        await ctx.db.patch(createdFormId, {
          pages: [createdPageId],
        });

        return { formId: createdFormId, pageId: createdPageId };
      });

      await asUser.mutation(api.formPages.remove, { pageId });

      const result = await t.run(async (ctx) => {
        const form = await ctx.db.get(formId);
        const page = await ctx.db.get(pageId);

        return { form, page };
      });

      expect(result.form?.pages).toHaveLength(0);
      expect(result.page).toBeNull();
    });

    it("should throw an error for non-existent page", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const pageId = await t.run(async (ctx) => {
        const formId = await ctx.db.insert("forms", {
          createdBy: userId,
          pages: [],
        });

        return await ctx.db.insert("formPages", {
          formId,
          title: "Page to Remove",
          fields: [],
        });
      });

      await t.run(async (ctx) => {
        await ctx.db.delete(pageId);
      });

      const asUser = t.withIdentity({ subject: userId });

      await expect(
        asUser.mutation(api.formPages.remove, {
          pageId,
        }),
      ).rejects.toThrow("Page not found");
    });
  });
});
