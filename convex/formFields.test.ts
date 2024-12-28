import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

describe("formFields", () => {
  describe("getById", () => {
    it("should return a form field by its ID", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      const fieldId = await t.run(async (ctx) => {
        return await ctx.db.insert("formFields", {
          type: "shortText",
          label: "First Name",
          name: "firstName",
          required: true,
        });
      });

      const field = await asUser.query(api.formFields.getById, { fieldId });
      expect(field).toBeTruthy();
      expect(field?.label).toBe("First Name");
      expect(field?.name).toBe("firstName");
      expect(field?.type).toBe("shortText");
      expect(field?.required).toBe(true);
    });
  });

  describe("getByIds", () => {
    it("should return multiple form fields by their IDs", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      const fieldIds = await t.run(async (ctx) => {
        const field1Id = await ctx.db.insert("formFields", {
          type: "shortText",
          label: "First Name",
          name: "firstName",
          required: true,
        });

        const field2Id = await ctx.db.insert("formFields", {
          type: "email",
          label: "Email",
          name: "email",
          required: true,
        });

        return [field1Id, field2Id];
      });

      const fields = await asUser.query(api.formFields.getByIds, { fieldIds });
      expect(fields).toHaveLength(2);
      expect(fields.map((f) => f.label)).toContain("First Name");
      expect(fields.map((f) => f.label)).toContain("Email");
    });
  });

  describe("getAll", () => {
    it("should return all form fields", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      await t.run(async (ctx) => {
        await ctx.db.insert("formFields", {
          type: "shortText",
          label: "First Name",
          name: "firstName",
          required: true,
        });

        await ctx.db.insert("formFields", {
          type: "email",
          label: "Email",
          name: "email",
          required: true,
        });
      });

      const fields = await asUser.query(api.formFields.getAll);
      expect(fields.length).toBeGreaterThanOrEqual(2);
      expect(fields.some((f) => f.label === "First Name")).toBeTruthy();
      expect(fields.some((f) => f.label === "Email")).toBeTruthy();
    });
  });

  describe("create", () => {
    it("should create a new form field", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      const fieldId = await asUser.mutation(api.formFields.create, {
        type: "shortText",
        label: "Phone Number",
        name: "phoneNumber",
        required: false,
      });

      await t.run(async (ctx) => {
        const field = await ctx.db.get(fieldId);
        expect(field).toBeTruthy();
        expect(field?.label).toBe("Phone Number");
        expect(field?.name).toBe("phoneNumber");
        expect(field?.type).toBe("shortText");
        expect(field?.required).toBe(false);
      });
    });
  });

  describe("update", () => {
    it("should update an existing form field", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      const fieldId = await t.run(async (ctx) => {
        return await ctx.db.insert("formFields", {
          type: "shortText",
          label: "Original Label",
          name: "originalName",
          required: false,
        });
      });

      await asUser.mutation(api.formFields.update, {
        fieldId,
        type: "email",
        label: "Updated Label",
        name: "updatedName",
        required: true,
      });

      await t.run(async (ctx) => {
        const field = await ctx.db.get(fieldId);
        expect(field).toBeTruthy();
        expect(field?.label).toBe("Updated Label");
        expect(field?.name).toBe("updatedName");
        expect(field?.type).toBe("email");
        expect(field?.required).toBe(true);
      });
    });
  });

  describe("remove", () => {
    it("should remove a form field", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      const fieldId = await t.run(async (ctx) => {
        return await ctx.db.insert("formFields", {
          type: "shortText",
          label: "To Be Deleted",
          name: "toBeDeleted",
          required: false,
        });
      });

      await asUser.mutation(api.formFields.remove, { fieldId });

      await t.run(async (ctx) => {
        const field = await ctx.db.get(fieldId);
        expect(field).toBeNull();
      });
    });
  });
});
