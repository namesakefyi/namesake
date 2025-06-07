import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";
import { createTestAdmin, createTestUser } from "../test-helpers";
import { modules } from "../test.setup";

describe("earlyAccessCodes", () => {
  it("creates an early access code", async () => {
    const t = convexTest(schema, modules);
    const { asAdmin, adminId } = await createTestAdmin(t);

    // Create a code
    await asAdmin.mutation(api.earlyAccessCodes.create, {});

    // Verify code creation
    const codes = await asAdmin.query(api.earlyAccessCodes.getAll, {});
    expect(codes.length).toBe(1);
    expect(codes[0]?.createdBy).toBe(adminId);
    expect(codes[0]?.claimedAt).toBeUndefined();
  });

  it("lists codes for a specific user", async () => {
    const t = convexTest(schema, modules);
    const { asUser: asUser1, userId: user1Id } = await createTestUser(
      t,
      "user1@example.com",
    );
    const { asUser: asUser2, userId: user2Id } = await createTestUser(
      t,
      "user2@example.com",
    );

    // Each user creates a code
    await asUser1.mutation(api.earlyAccessCodes.create, {});
    await asUser1.mutation(api.earlyAccessCodes.create, {});
    await asUser2.mutation(api.earlyAccessCodes.create, {});

    // Verify user1's codes
    const user1Codes = await asUser1.query(
      api.earlyAccessCodes.getCodesForUser,
    );
    expect(user1Codes.length).toBe(2);
    expect(user1Codes[0]?.createdBy).toBe(user1Id);
    expect(user1Codes[1]?.createdBy).toBe(user1Id);

    // Verify user2's codes
    const user2Codes = await asUser2.query(
      api.earlyAccessCodes.getCodesForUser,
    );
    expect(user2Codes.length).toBe(1);
    expect(user2Codes[0]?.createdBy).toBe(user2Id);
  });

  it("redeems an early access code", async () => {
    const t = convexTest(schema, modules);
    const { asAdmin } = await createTestAdmin(t);
    const { asUser } = await createTestUser(t);

    // (Admin) Create a code
    const codeId = await asAdmin.mutation(api.earlyAccessCodes.create, {});

    // (User) Redeem the code
    await asUser.mutation(api.earlyAccessCodes.redeem, {
      earlyAccessCodeId: codeId,
    });

    // (Admin) Verify code is redeemed
    const codes = await asAdmin.query(api.earlyAccessCodes.getAll, {});
    expect(codes[0]?.claimedAt).toBeDefined();
  });

  it("prevents redeeming an already claimed code", async () => {
    const t = convexTest(schema, modules);
    const { asAdmin } = await createTestAdmin(t);

    const codeId = await asAdmin.mutation(api.earlyAccessCodes.create, {});

    const { asUser: asUser1 } = await createTestUser(t, "user1@example.com");
    const { asUser: asUser2 } = await createTestUser(t, "user2@example.com");

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
