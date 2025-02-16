import { convexTest } from "convex-test";
import { beforeEach, describe, expect, it } from "vitest";
import migrationsSchema from "../node_modules/@convex-dev/migrations/src/component/schema";
import { internal } from "./_generated/api";
import { migrations } from "./migrations";
import schema from "./schema";
import { modules } from "./test.setup";

const migrationsModules = import.meta.glob(
  "../node_modules/@convex-dev/migrations/src/component/**/*.ts",
);

// Tests inspired by https://github.com/get-convex/aggregate/blob/main/example/convex/aggregate.test.ts.
describe("migrations", () => {
  async function setupTest() {
    const t = convexTest(schema, modules);

    t.registerComponent("migrations", migrationsSchema, migrationsModules);
    return t;
  }

  let t: Awaited<ReturnType<typeof setupTest>>;

  beforeEach(async () => {
    t = await setupTest();
  });

  describe("setQuestsUpdatedTimestamp", () => {
    it("sets updatedAt timestamp for quests where it’s undefined", async () => {
      await t.run(async (ctx) => {
        const userId = await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });

        const questId = await ctx.db.insert("quests", {
          title: "Test Quest",
          creationUser: userId,
          slug: "test-quest",
          // updatedAt intentionally omitted
        });

        await migrations.runOne(
          ctx,
          internal.migrations.setQuestsUpdatedTimestamp,
        );

        const updatedQuest = await ctx.db.get(questId);
        expect(updatedQuest?.updatedAt).toBeDefined();
        expect(typeof updatedQuest?.updatedAt).toBe("number");
      });
    });

    it("doesn’t modify quests that already have updatedAt", async () => {
      const existingTimestamp = Date.now();

      await t.run(async (ctx) => {
        const userId = await ctx.db.insert("users", {
          email: "test@example.com",
          role: "user",
        });

        const questId = await ctx.db.insert("quests", {
          title: "Test Quest",
          creationUser: userId,
          slug: "test-quest",
          updatedAt: existingTimestamp,
        });

        await migrations.runOne(
          ctx,
          internal.migrations.setQuestsUpdatedTimestamp,
        );

        // Verify the quest’s timestamp wasn’t modified
        const updatedQuest = await ctx.db.get(questId);
        expect(updatedQuest?.updatedAt).toBe(existingTimestamp);
      });
    });
  });
});
