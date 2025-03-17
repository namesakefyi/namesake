import type { MutationCtx } from "../_generated/server";
import * as Users from "./users";

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
    .then((userId) => {
      // Initialize default user settings
      ctx.db.insert("userSettings", {
        userId,
        theme: "system",
      });

      return userId;
    });
}
