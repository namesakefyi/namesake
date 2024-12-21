import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import { DUPLICATE_EMAIL, INVALID_EMAIL } from "./errors";
import schema from "./schema";
import { modules } from "./test.setup";

describe("users", () => {
  describe("getAll", () => {
    it("should return all users", async () => {
      const t = convexTest(schema, modules);

      await t.run(async (ctx) => {
        await ctx.db.insert("users", {
          email: "test1@example.com",
          role: "user",
        });

        await ctx.db.insert("users", {
          email: "test2@example.com",
          role: "admin",
        });
      });

      const users = await t.query(api.users.getAll, {});
      expect(users).toHaveLength(2);
      expect(users.map((u) => u.email)).toContain("test1@example.com");
      expect(users.map((u) => u.email)).toContain("test2@example.com");
    });
  });

  describe("getCurrent", () => {
    it("should return the current user", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
          name: "Test User",
        });
      });

      const asUser = t.withIdentity({ subject: userId });
      const user = await asUser.query(api.users.getCurrent, {});
      expect(user?.email).toBe("test@example.com");
      expect(user?.name).toBe("Test User");
    });

    it("should return null if user not found", async () => {
      const t = convexTest(schema, modules);
      const asUser = t.withIdentity({ subject: "invalid_id" });
      const user = await asUser.query(api.users.getCurrent, {});
      expect(user).toBeNull();
    });
  });

  describe("getCurrentRole", () => {
    it("should return the current user's role", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "admin",
        });
      });

      const asUser = t.withIdentity({ subject: userId });
      const role = await asUser.query(api.users.getCurrentRole, {});
      expect(role).toBe("admin");
    });

    it("should return null if user not authenticated", async () => {
      const t = convexTest(schema, modules);
      const role = await t.query(api.users.getCurrentRole, {});
      expect(role).toBeNull();
    });
  });

  describe("getByEmail", () => {
    it("should return user by email", async () => {
      const t = convexTest(schema, modules);

      await t.run(async (ctx) => {
        await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
          name: "Test User",
        });
      });

      const user = await t.query(api.users.getByEmail, {
        email: "test@example.com",
      });
      expect(user?.name).toBe("Test User");
    });

    it("should return null if user not found", async () => {
      const t = convexTest(schema, modules);
      const user = await t.query(api.users.getByEmail, {
        email: "nonexistent@example.com",
      });
      expect(user).toBeNull();
    });
  });

  describe("setName", () => {
    it("should update user name", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });
      await asUser.mutation(api.users.setName, {
        name: "New Name",
      });

      const user = await t.run(async (ctx) => {
        return await ctx.db.get(userId);
      });
      expect(user?.name).toBe("New Name");
    });

    it("should clear user name when undefined", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
          name: "Test User",
        });
      });

      const asUser = t.withIdentity({ subject: userId });
      await asUser.mutation(api.users.setName, {
        name: undefined,
      });

      const user = await t.run(async (ctx) => {
        return await ctx.db.get(userId);
      });
      expect(user?.name).toBeUndefined();
    });
  });

  describe("setEmail", () => {
    it("should update the user's email", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "old@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });
      await asUser.mutation(api.users.setEmail, {
        email: "new@example.com",
      });

      const user = await t.run(async (ctx) => {
        return await ctx.db.get(userId);
      });
      expect(user?.email).toBe("new@example.com");
    });

    it("should throw an error for an invalid email", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "valid@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });
      await expect(
        asUser.mutation(api.users.setEmail, { email: "invalid-email" }),
      ).rejects.toThrow(INVALID_EMAIL);
    });

    it("should throw an error for a duplicate email", async () => {
      const t = convexTest(schema, modules);

      await t.run(async (ctx) => {
        await ctx.db.insert("users", {
          email: "existing@example.com",
          role: "user",
        });
      });

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "new@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });
      await expect(
        asUser.mutation(api.users.setEmail, { email: "existing@example.com" }),
      ).rejects.toThrow(DUPLICATE_EMAIL);
    });
  });

  describe("setBirthplace", () => {
    it("should update user birthplace", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });
      await asUser.mutation(api.users.setBirthplace, {
        birthplace: "CA",
      });

      const user = await t.run(async (ctx) => {
        return await ctx.db.get(userId);
      });
      expect(user?.birthplace).toBe("CA");
    });
  });

  describe("setCurrentUserIsMinor", () => {
    it("should update user isMinor status", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      const asUser = t.withIdentity({ subject: userId });
      await asUser.mutation(api.users.setCurrentUserIsMinor, {
        isMinor: true,
      });

      const user = await t.run(async (ctx) => {
        return await ctx.db.get(userId);
      });
      expect(user?.isMinor).toBe(true);
    });
  });

  describe("deleteCurrentUser", () => {
    it("should delete user and all associated data", async () => {
      const t = convexTest(schema, modules);

      // Create test user
      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });
      });

      // Create associated data
      await t.run(async (ctx) => {
        // Create user settings
        await ctx.db.insert("userSettings", {
          userId,
          theme: "dark",
          groupQuestsBy: "category",
        });

        // Create quest
        const questId = await ctx.db.insert("quests", {
          title: "Test Quest",
          category: "Test Category",
          jurisdiction: "Test Jurisdiction",
          creationUser: userId,
        });

        // Create user quest
        await ctx.db.insert("userQuests", {
          userId,
          questId,
          status: "active",
        });
      });

      // Delete user and verify all data is deleted
      const asUser = t.withIdentity({ subject: userId });
      await asUser.mutation(api.users.deleteCurrentUser, {});

      await t.run(async (ctx) => {
        // Verify user is deleted
        const user = await ctx.db.get(userId);
        expect(user).toBeNull();

        // Verify user settings are deleted
        const settings = await ctx.db
          .query("userSettings")
          .withIndex("userId", (q) => q.eq("userId", userId))
          .first();
        expect(settings).toBeNull();

        // Verify user quests are deleted
        const quests = await ctx.db
          .query("userQuests")
          .withIndex("userId", (q) => q.eq("userId", userId))
          .collect();
        expect(quests).toHaveLength(0);
      });
    });
  });
});
