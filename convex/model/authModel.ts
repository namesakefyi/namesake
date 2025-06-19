import type { MutationCtx } from "../_generated/server";
import * as UserQuestPlaceholders from "./userQuestPlaceholdersModel";
import * as Users from "./usersModel";

export async function createOrUpdateUser(ctx: MutationCtx, args: any) {
  // Handle merging updated fields into existing user
  if (args.existingUserId) {
    return args.existingUserId;
  }

  // Handle account linking
  if (args.profile.email) {
    const existingUser = await Users.getByEmail(ctx, {
      email: args.profile.email,
    });
    if (existingUser) return existingUser._id;
  }

  // Create a new user with defaults
  return ctx.db
    .insert("users", {
      email: args.profile.email,
      emailVerified: args.profile.emailVerified ?? false,
      role: process.env.NODE_ENV === "development" ? "admin" : "user",
    })
    .then(async (userId) => {
      // Initialize default user settings
      await ctx.db.insert("userSettings", {
        userId,
        theme: "system",
        color: "rainbow",
      });

      // Initialize default placeholders
      await UserQuestPlaceholders.createDefaultPlaceholdersForUser(ctx, {
        userId,
      });

      return userId;
    });
}
