import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";
import { modules } from "../test.setup";
import { createTestUser } from "./helpers";

describe("userSettings", () => {
  describe("getCurrentUserSettings", () => {
    it("should throw error if user settings not found", async () => {
      const t = convexTest(schema, modules);
      const { asUser } = await createTestUser(t);

      await expect(
        asUser.query(api.userSettings.getCurrentUserSettings),
      ).rejects.toThrow("User settings not found");
    });

    it("should return user settings if found", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      const settingsId = await t.run(async (ctx) => {
        return await ctx.db.insert("userSettings", {
          userId,
          theme: "dark",
        });
      });

      const settings = await asUser.query(
        api.userSettings.getCurrentUserSettings,
      );

      expect(settings._id).toBe(settingsId);
      expect(settings.theme).toBe("dark");
    });
  });

  describe("setTheme", () => {
    it("should throw error if user settings not found", async () => {
      const t = convexTest(schema, modules);
      const { asUser } = await createTestUser(t);

      await expect(
        asUser.mutation(api.userSettings.setTheme, {
          theme: "dark",
        }),
      ).rejects.toThrow("User settings not found");
    });

    it("should update existing user settings theme", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      await t.run(async (ctx) => {
        return await ctx.db.insert("userSettings", {
          userId,
          theme: "light",
        });
      });

      await asUser.mutation(api.userSettings.setTheme, {
        theme: "dark",
      });

      const settings = await asUser.query(
        api.userSettings.getCurrentUserSettings,
      );
      expect(settings.theme).toBe("dark");
    });
  });

  describe("setColor", () => {
    it("should throw error if user settings not found", async () => {
      const t = convexTest(schema, modules);
      const { asUser } = await createTestUser(t);

      await expect(
        asUser.mutation(api.userSettings.setColor, {
          color: "pink",
        }),
      ).rejects.toThrow("User settings not found");
    });

    it("should update existing user settings color", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      await t.run(async (ctx) => {
        return await ctx.db.insert("userSettings", {
          userId,
          color: "green",
        });
      });

      await asUser.mutation(api.userSettings.setColor, {
        color: "pink",
      });

      const settings = await asUser.query(
        api.userSettings.getCurrentUserSettings,
      );
      expect(settings.color).toBe("pink");
    });
  });
});
