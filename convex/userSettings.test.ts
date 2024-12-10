import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

describe("userSettings", () => {
  describe("getByUserId", () => {
    it("should throw error if user settings not found", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      await expect(
        t.query(api.userSettings.getByUserId, { userId }),
      ).rejects.toThrow("User settings not found");
    });

    it("should return user settings if found", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const settingsId = await t.run(async (ctx) => {
        return await ctx.db.insert("userSettings", {
          userId,
          theme: "dark",
          groupQuestsBy: "category",
        });
      });

      const settings = await t.query(api.userSettings.getByUserId, { userId });

      expect(settings._id).toBe(settingsId);
      expect(settings.theme).toBe("dark");
      expect(settings.groupQuestsBy).toBe("category");
    });
  });

  describe("setTheme", () => {
    it("should throw error if user settings not found", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      await expect(
        asUser.mutation(api.userSettings.setTheme, {
          theme: "dark",
        }),
      ).rejects.toThrow("User settings not found");
    });

    it("should update existing user settings theme", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      await t.run(async (ctx) => {
        return await ctx.db.insert("userSettings", {
          userId,
          theme: "light",
          groupQuestsBy: "category",
        });
      });

      await asUser.mutation(api.userSettings.setTheme, {
        theme: "dark",
      });

      const settings = await t.query(api.userSettings.getByUserId, { userId });
      expect(settings.theme).toBe("dark");
      expect(settings.groupQuestsBy).toBe("category"); // unchanged
    });
  });

  describe("setGroupQuestsBy", () => {
    it("should throw error if user settings not found", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      await expect(
        asUser.mutation(api.userSettings.setGroupQuestsBy, {
          groupQuestsBy: "status",
        }),
      ).rejects.toThrow("User settings not found");
    });

    it("should update existing user settings groupQuestsBy", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });

      await t.run(async (ctx) => {
        return await ctx.db.insert("userSettings", {
          userId,
          theme: "dark",
          groupQuestsBy: "category",
        });
      });

      await asUser.mutation(api.userSettings.setGroupQuestsBy, {
        groupQuestsBy: "status",
      });

      const settings = await t.query(api.userSettings.getByUserId, { userId });
      expect(settings.groupQuestsBy).toBe("status");
      expect(settings.theme).toBe("dark"); // unchanged
    });
  });
});
