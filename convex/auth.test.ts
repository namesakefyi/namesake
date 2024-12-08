import { faker } from "@faker-js/faker";
import { convexTest } from "convex-test";
import { describe, expect, it, vi } from "vitest";
import { api } from "./_generated/api";
import { createOrUpdateUser } from "./auth";
import schema from "./schema";
import { modules } from "./test.setup";

describe("auth roles", () => {
  it("should set role to admin in development environment", async () => {
    const t = convexTest(schema, modules);

    const email = faker.internet.email();

    // Set NODE_ENV to development
    vi.stubEnv("NODE_ENV", "development");
    await t.run(async (ctx) => {
      return await createOrUpdateUser(ctx, {
        profile: {
          email,
        },
      });
    });

    const user = await t.query(api.users.getByEmail, {
      email,
    });

    expect(user?.role).toBe("admin");
    vi.unstubAllEnvs();
  });

  it("should set role to user in production environment", async () => {
    const t = convexTest(schema, modules);

    const email = faker.internet.email();

    // Set NODE_ENV to production
    vi.stubEnv("NODE_ENV", "production");
    await t.run(async (ctx) => {
      return await createOrUpdateUser(ctx, {
        profile: {
          email,
        },
      });
    });

    const user = await t.query(api.users.getByEmail, {
      email,
    });

    expect(user?.role).toBe("user");
    vi.unstubAllEnvs();
  });
});
