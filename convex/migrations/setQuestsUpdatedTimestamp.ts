import { migrations } from "../migrations";

// Set the updatedAt timestamp for quests where it is undefined.
export const setQuestsUpdatedTimestamp = migrations.define({
  table: "quests",
  migrateOne: async (ctx, quest) => {
    if (quest.updatedAt === undefined) {
      await ctx.db.patch(quest._id, { updatedAt: Date.now() });
    }
  },
});
