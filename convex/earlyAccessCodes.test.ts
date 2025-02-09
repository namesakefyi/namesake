import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

describe("earlyAccessCodes", () => {
  it("creates an early access code", async () => {
    const t = convexTest(schema, modules);

    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        email: "test@example.com",
        role: "admin",
      });
    });

    const asUser = t.withIdentity({ subject: userId });

    // Create a code
    await asUser.mutation(api.earlyAccessCodes.create, {});

    // Verify code creation
    const codes = await t.query(api.earlyAccessCodes.getAll, {});
    expect(codes.length).toBe(1);
    expect(codes[0]?.createdBy).toBe(userId);
    expect(codes[0]?.claimedAt).toBeUndefined();
  });

  it("lists codes for a specific user", async () => {
    const t = convexTest(schema, modules);

    // Create two users
    const user1Id = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        email: "user1@example.com",
        role: "admin",
      });
    });

    const user2Id = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        email: "user2@example.com",
        role: "admin",
      });
    });

    const asUser1 = t.withIdentity({ subject: user1Id });
    const asUser2 = t.withIdentity({ subject: user2Id });

    // Each user creates a code
    await asUser1.mutation(api.earlyAccessCodes.create, {});
    await asUser1.mutation(api.earlyAccessCodes.create, {});
    await asUser2.mutation(api.earlyAccessCodes.create, {});

    // Verify user1's codes
    const user1Codes = await t.query(api.earlyAccessCodes.getCodesForUser, {
      userId: user1Id,
    });
    expect(user1Codes.length).toBe(2);
    expect(user1Codes[0]?.createdBy).toBe(user1Id);
    expect(user1Codes[1]?.createdBy).toBe(user1Id);

    // Verify user2's codes
    const user2Codes = await t.query(api.earlyAccessCodes.getCodesForUser, {
      userId: user2Id,
    });
    expect(user2Codes.length).toBe(1);
    expect(user2Codes[0]?.createdBy).toBe(user2Id);
  });

  it("redeems an early access code", async () => {
    const t = convexTest(schema, modules);

    // Create admin user to generate code
    const adminId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        email: "admin@example.com",
        role: "admin",
      });
    });

    const asAdmin = t.withIdentity({ subject: adminId });

    // Create a code
    const codeId = await asAdmin.mutation(api.earlyAccessCodes.create, {});

    // Create user to redeem code
    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        email: "user@example.com",
        role: "user",
      });
    });

    const asUser = t.withIdentity({ subject: userId });

    // Redeem the code
    await asUser.mutation(api.earlyAccessCodes.redeem, {
      earlyAccessCodeId: codeId,
    });

    // Verify code is redeemed
    const codes = await t.query(api.earlyAccessCodes.getAll, {});
    expect(codes[0]?.claimedAt).toBeDefined();
  });

  it("prevents redeeming an already claimed code", async () => {
    const t = convexTest(schema, modules);

    // Create admin and code
    const adminId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        email: "admin@example.com",
        role: "admin",
      });
    });

    const asAdmin = t.withIdentity({ subject: adminId });
    const codeId = await asAdmin.mutation(api.earlyAccessCodes.create, {});

    // Create two users
    const user1Id = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        email: "user1@example.com",
        role: "user",
      });
    });

    const user2Id = await t.run(async (ctx) => {
      return await ctx.db.insert("users", {
        email: "user2@example.com",
        role: "user",
      });
    });

    const asUser1 = t.withIdentity({ subject: user1Id });
    const asUser2 = t.withIdentity({ subject: user2Id });

    // First user redeems code
    await asUser1.mutation(api.earlyAccessCodes.redeem, {
      earlyAccessCodeId: codeId,
    });

    // Second user attempts to redeem same code
    await expect(
      asUser2.mutation(api.earlyAccessCodes.redeem, {
        earlyAccessCodeId: codeId,
      }),
    ).rejects.toThrow("This code has already been redeemed.");
  });
});
