import { convexTest } from "convex-test";
import { describe, expect, it, vi } from "vitest";
import { createTestAdmin } from "../../__tests__/helpers";
import { api } from "../../_generated/api";
import schema from "../../schema";
import { modules } from "../../test.setup";
import { createOrUpdateUser } from "../authModel";

describe("authModel", () => {
  describe("createOrUpdateUser", () => {
    it("should return existing user if id already exists", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert("users", {
          email: "testUser@test.com",
          role: "user",
        });
      });

      const user = await t.run(async (ctx) => {
        return await createOrUpdateUser(ctx, {
          existingUserId: userId,
        });
      });

      expect(user).toBe(userId);
    });

    it("should set role to admin in development environment", async () => {
      const t = convexTest(schema, modules);
      const { asAdmin } = await createTestAdmin(t);

      vi.stubEnv("NODE_ENV", "development");
      await t.run(async (ctx) => {
        return await createOrUpdateUser(ctx, {
          profile: {
            email: "devUser@test.com",
          },
        });
      });

      const user = await asAdmin.query(api.users.getByEmail, {
        email: "devUser@test.com",
      });

      expect(user?.role).toBe("admin");
      vi.unstubAllEnvs();
    });

    it("should set role to user in production environment", async () => {
      const t = convexTest(schema, modules);
      const { asAdmin } = await createTestAdmin(t);

      vi.stubEnv("NODE_ENV", "production");
      await t.run(async (ctx) => {
        return await createOrUpdateUser(ctx, {
          profile: {
            email: "prodUser@test.com",
          },
        });
      });

      const user = await asAdmin.query(api.users.getByEmail, {
        email: "prodUser@test.com",
      });

      expect(user?.role).toBe("user");
      vi.unstubAllEnvs();
    });

    it("should initialize default user settings", async () => {
      const t = convexTest(schema, modules);

      const userId = await t.run(async (ctx) => {
        return await createOrUpdateUser(ctx, {
          profile: {
            email: "testUser@test.com",
          },
        });
      });
      const asUser = t.withIdentity({ subject: userId });

      const userSettings = await asUser.query(
        api.userSettings.getCurrentUserSettings,
      );

      expect(userSettings).toBeDefined();
      expect(userSettings?.theme).toBe("system");
      expect(userSettings?.color).toBe("rainbow");
    });
  });
});
