import { faker } from "@faker-js/faker";
import { convexTest } from "convex-test";
import { describe, expect, it, vi } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

describe("auth roles", () => {
  it("should set role to admin in development environment", async () => {
    const t = convexTest(schema, modules);

    const dummyUser = {
      email: faker.internet.email(),
      emailVerified: faker.datatype.boolean(),
    };

    // Set NODE_ENV to development
    vi.stubEnv("NODE_ENV", "development");

    await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        ...dummyUser,
        role: process.env.NODE_ENV === "development" ? "admin" : "user",
      });
    });
    const user = await t.query(api.users.getByEmail, {
      email: dummyUser.email,
    });

    expect(user?.role).toBe("admin");
    vi.unstubAllEnvs();
  });

  it("should set role to user in production environment", async () => {
    const t = convexTest(schema, modules);

    const dummyUser = {
      email: faker.internet.email(),
      emailVerified: faker.datatype.boolean(),
    };

    // Set NODE_ENV to production
    vi.stubEnv("NODE_ENV", "production");
    await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        ...dummyUser,
        role: process.env.NODE_ENV === "development" ? "admin" : "user",
      });
    });
    const user = await t.query(api.users.getByEmail, {
      email: dummyUser.email,
    });

    expect(user?.role).toBe("user");
    vi.unstubAllEnvs();
  });
});
