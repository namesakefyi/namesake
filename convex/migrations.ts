import { Migrations } from "@convex-dev/migrations";
import { components, internal } from "./_generated/api.js";
import type { DataModel } from "./_generated/dataModel.js";

export const migrations = new Migrations<DataModel>(components.migrations);
export const run = migrations.runner();

export { setQuestsUpdatedTimestamp } from "./migrations/setQuestsUpdatedTimestamp";

// Run the setQuestsUpdatedTimestamp migration.
export const runSetQuestsUpdatedTimestamp = migrations.runner(
  internal.migrations.setQuestsUpdatedTimestamp,
);
