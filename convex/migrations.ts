import { Migrations } from "@convex-dev/migrations";
import { components, internal } from "./_generated/api.js";
import type { DataModel } from "./_generated/dataModel.js";

export const migrations = new Migrations<DataModel>(components.migrations);
export const run = migrations.runner();

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
