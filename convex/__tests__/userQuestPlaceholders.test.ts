import { convexTest } from "convex-test";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";
import { modules } from "../test.setup";
import { createTestUser } from "./helpers";

const UPDATE_TIMESTAMP = Date.now();

describe("userQuestPlaceholders API", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(UPDATE_TIMESTAMP);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("createDefault", () => {
    it("should create default placeholders for user", async () => {
      const t = convexTest(schema, modules);
      const { asUser } = await createTestUser(t);

      await asUser.mutation(api.userQuestPlaceholders.createDefault, {});

      const placeholders = await asUser.query(
        api.userQuestPlaceholders.getActive,
        {},
      );
      expect(placeholders.length).toBeGreaterThan(0);
    });
  });

  describe("create", () => {
    it("should create a placeholder for specific category", async () => {
      const t = convexTest(schema, modules);
      const { asUser } = await createTestUser(t);

      const placeholderId = await asUser.mutation(
        api.userQuestPlaceholders.create,
        {
          category: "courtOrder",
        },
      );

      expect(placeholderId).toBeDefined();

      const placeholders = await asUser.query(
        api.userQuestPlaceholders.getActive,
        {},
      );
      expect(placeholders.some((p) => p.category === "courtOrder")).toBe(true);
    });
  });

  describe("dismiss", () => {
    it("should dismiss a placeholder", async () => {
      const t = convexTest(schema, modules);
      const { asUser } = await createTestUser(t);

      await asUser.mutation(api.userQuestPlaceholders.create, {
        category: "courtOrder",
      });

      await asUser.mutation(api.userQuestPlaceholders.dismiss, {
        category: "courtOrder",
      });

      const placeholders = await asUser.query(
        api.userQuestPlaceholders.getActive,
        {},
      );
      expect(placeholders.some((p) => p.category === "courtOrder")).toBe(false);
    });
  });

  describe("restore", () => {
    it("should restore a dismissed placeholder", async () => {
      const t = convexTest(schema, modules);
      const { asUser } = await createTestUser(t);

      await asUser.mutation(api.userQuestPlaceholders.create, {
        category: "courtOrder",
      });
      await asUser.mutation(api.userQuestPlaceholders.dismiss, {
        category: "courtOrder",
      });

      await asUser.mutation(api.userQuestPlaceholders.restore, {
        category: "courtOrder",
      });

      const placeholders = await asUser.query(
        api.userQuestPlaceholders.getActive,
        {},
      );
      expect(placeholders.some((p) => p.category === "courtOrder")).toBe(true);
    });
  });

  describe("getActive", () => {
    it("should return only active placeholders", async () => {
      const t = convexTest(schema, modules);
      const { asUser } = await createTestUser(t);

      await asUser.mutation(api.userQuestPlaceholders.create, {
        category: "courtOrder",
      });
      await asUser.mutation(api.userQuestPlaceholders.create, {
        category: "passport",
      });

      await asUser.mutation(api.userQuestPlaceholders.dismiss, {
        category: "courtOrder",
      });

      const placeholders = await asUser.query(
        api.userQuestPlaceholders.getActive,
        {},
      );
      expect(placeholders.some((p) => p.category === "courtOrder")).toBe(false);
      expect(placeholders.some((p) => p.category === "passport")).toBe(true);
    });

    it("should return empty array when no placeholders exist", async () => {
      const t = convexTest(schema, modules);
      const { asUser } = await createTestUser(t);

      const placeholders = await asUser.query(
        api.userQuestPlaceholders.getActive,
        {},
      );
      expect(placeholders).toHaveLength(0);
    });
  });
});
