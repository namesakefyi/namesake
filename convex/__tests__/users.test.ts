import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { DUPLICATE_EMAIL, INVALID_EMAIL } from "../../src/constants/errors";
import { api } from "../_generated/api";
import schema from "../schema";
import { createTestAdmin, createTestUser } from "../test-helpers";
import { modules } from "../test.setup";

describe("users", () => {
  describe("getAll", () => {
    it("should return an error if not authenticated", async () => {
      const t = convexTest(schema, modules);
      await expect(t.query(api.users.getAll, {})).rejects.toThrow(
        "Not authenticated",
      );
    });

    it("should return an error if not authorized", async () => {
      const t = convexTest(schema, modules);
      const { asUser } = await createTestUser(t);
      await expect(asUser.query(api.users.getAll, {})).rejects.toThrow(
        "Insufficient permissions",
      );
    });

    it("should return all users", async () => {
      const t = convexTest(schema, modules);
      const { asAdmin } = await createTestAdmin(t);
      await createTestUser(t, "test1@example.com");
      await createTestUser(t, "test2@example.com");

      const users = await asAdmin.query(api.users.getAll, {});
      expect(users).toHaveLength(3);
      expect(users.map((u) => u.email)).toContain("admin@namesake.fyi");
      expect(users.map((u) => u.email)).toContain("test1@example.com");
      expect(users.map((u) => u.email)).toContain("test2@example.com");
    });
  });

  describe("getCurrent", () => {
    it("should return the current user", async () => {
      const t = convexTest(schema, modules);
      const { asUser } = await createTestUser(
        t,
        "test@example.com",
        "Test User",
      );

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
      const { asUser } = await createTestUser(t);

      const role = await asUser.query(api.users.getCurrentRole, {});
      expect(role).toBe("user");

      const { asAdmin } = await createTestAdmin(t);
      const adminRole = await asAdmin.query(api.users.getCurrentRole, {});
      expect(adminRole).toBe("admin");
    });

    it("should return null if user not authenticated", async () => {
      const t = convexTest(schema, modules);
      const role = await t.query(api.users.getCurrentRole, {});
      expect(role).toBeNull();
    });
  });

  describe("getByEmail", () => {
    it("should return an error if not authenticated", async () => {
      const t = convexTest(schema, modules);
      await expect(
        t.query(api.users.getByEmail, { email: "test@example.com" }),
      ).rejects.toThrow("Not authenticated");
    });

    it("should return an error if not authorized", async () => {
      const t = convexTest(schema, modules);
      const { asUser } = await createTestUser(t);
      await expect(
        asUser.query(api.users.getByEmail, { email: "test@example.com" }),
      ).rejects.toThrow("Insufficient permissions");
    });

    it("should return user by email", async () => {
      const t = convexTest(schema, modules);
      const { asAdmin } = await createTestAdmin(t);
      await createTestUser(t, "test@example.com", "Test User");

      const user = await asAdmin.query(api.users.getByEmail, {
        email: "test@example.com",
      });
      expect(user?.name).toBe("Test User");
    });

    it("should return null if user not found", async () => {
      const t = convexTest(schema, modules);
      const { asAdmin } = await createTestAdmin(t);

      const user = await asAdmin.query(api.users.getByEmail, {
        email: "nonexistent@example.com",
      });
      expect(user).toBeNull();
    });
  });

  describe("setName", () => {
    it("should update user name", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

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
      const { asUser, userId } = await createTestUser(t);

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
      const { asUser, userId } = await createTestUser(t);

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
      const { asUser } = await createTestUser(t);

      await expect(
        asUser.mutation(api.users.setEmail, { email: "invalid-email" }),
      ).rejects.toThrow(INVALID_EMAIL);
    });

    it("should throw an error for a duplicate email", async () => {
      const t = convexTest(schema, modules);
      await createTestUser(t, "existing@example.com");
      const { asUser } = await createTestUser(t, "new@example.com");

      await expect(
        asUser.mutation(api.users.setEmail, { email: "existing@example.com" }),
      ).rejects.toThrow(DUPLICATE_EMAIL);
    });
  });

  describe("setBirthplace", () => {
    it("should update user birthplace", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      await asUser.mutation(api.users.setBirthplace, {
        birthplace: "CA",
      });

      const user = await t.run(async (ctx) => {
        return await ctx.db.get(userId);
      });
      expect(user?.birthplace).toBe("CA");
    });
  });

  describe("setResidence", () => {
    it("should update user residence", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

      await asUser.mutation(api.users.setResidence, {
        residence: "CA",
      });

      const user = await t.run(async (ctx) => {
        return await ctx.db.get(userId);
      });
      expect(user?.residence).toBe("CA");
    });
  });

  describe("setCurrentUserIsMinor", () => {
    it("should update user isMinor status", async () => {
      const t = convexTest(schema, modules);
      const { asUser, userId } = await createTestUser(t);

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
      const { asUser, userId } = await createTestUser(t);

      // Create associated data
      await t.run(async (ctx) => {
        // Create user settings
        await ctx.db.insert("userSettings", {
          userId,
          theme: "dark",
        });

        // Create quest
        const questId = await ctx.db.insert("quests", {
          title: "Test Quest",
          slug: "test-quest",
          category: "Test Category",
          jurisdiction: "Test Jurisdiction",
          creationUser: userId,
          updatedAt: Date.now(),
        });

        // Create user quest
        await ctx.db.insert("userQuests", {
          userId,
          questId,
          status: "active",
        });
      });

      // Delete user and verify all data is deleted
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

  describe("isSignedIn", () => {
    it("should return true when user is authenticated", async () => {
      const t = convexTest(schema, modules);
      const { asUser } = await createTestUser(t);
      const isSignedIn = await asUser.query(api.users.isSignedIn, {});
      expect(isSignedIn).toBe(true);
    });

    it("should return false when user is not authenticated", async () => {
      const t = convexTest(schema, modules);
      const isSignedIn = await t.query(api.users.isSignedIn, {});
      expect(isSignedIn).toBe(false);
    });
  });
});
