import { Migrations } from "@convex-dev/migrations";
import { components } from "./_generated/api.js";
import type { DataModel } from "./_generated/dataModel.js";

export const migrations = new Migrations<DataModel>(components.migrations);
export const run = migrations.runner();

// Sets the `updatedAt` timestamp for all quests in preparation for making it required.
export const setQuestsUpdatedAtTimestamp = migrations.define({
  table: "quests",
  migrateOne: async (ctx, quest) => {
    if (quest.updatedAt === undefined) {
      await ctx.db.patch(quest._id, { updatedAt: Date.now() });
    }
  },
});
