import { convexTest } from "convex-test";
import { describe, expect, it, vi } from "vitest";
import { api } from "./_generated/api";
import { createOrUpdateUser } from "./auth";
import schema from "./schema";
import { modules } from "./test.setup";

describe("auth", () => {
  describe("createOrUpdateUser", () => {
    it("should set role to admin in development environment", async () => {
      const t = convexTest(schema, modules);

      vi.stubEnv("NODE_ENV", "development");
      await t.run(async (ctx) => {
        return await createOrUpdateUser(ctx, {
          profile: {
            email: "devUser@test.com",
          },
        });
      });

      const user = await t.query(api.users.getByEmail, {
        email: "devUser@test.com",
      });

      expect(user?.role).toBe("admin");
      vi.unstubAllEnvs();
    });

    it("should set role to user in production environment", async () => {
      const t = convexTest(schema, modules);

      vi.stubEnv("NODE_ENV", "production");
      await t.run(async (ctx) => {
        return await createOrUpdateUser(ctx, {
          profile: {
            email: "prodUser@test.com",
          },
        });
      });

      const user = await t.query(api.users.getByEmail, {
        email: "prodUser@test.com",
      });

      expect(user?.role).toBe("user");
      vi.unstubAllEnvs();
    });
  });
});
