import { Migrations } from "@convex-dev/migrations";
import { components, internal } from "./_generated/api.js";
import type { DataModel } from "./_generated/dataModel.js";

export const migrations = new Migrations<DataModel>(components.migrations);
export const run = migrations.runner();

// Backfill `isRequired` as true for all quests
export const setQuestCostsRequired = migrations.define({
  table: "quests",
  migrateOne: async (ctx, quest) => {
    await ctx.db.patch(quest._id, {
      costs: quest.costs?.map((c) => ({ ...c, isRequired: true })),
    });
  },
});

// Set the updatedAt timestamp for quests where it is undefined.
export const setQuestsUpdatedTimestamp = migrations.define({
  table: "quests",
  migrateOne: async (ctx, quest) => {
    if (quest.updatedAt === undefined) {
      await ctx.db.patch(quest._id, { updatedAt: Date.now() });
    }
  },
});

// Run the setQuestsUpdatedTimestamp migration.
export const runSetQuestsUpdatedTimestamp = migrations.runner(
  internal.migrations.setQuestsUpdatedTimestamp,
);
