import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import type { MutationCtx } from "./_generated/server";
import { ResendOTPPasswordReset } from "./passwordReset";
import { getByEmail } from "./users";

export const createOrUpdateUser = async (ctx: MutationCtx, args: any) => {
  // Handle merging updated fields into existing user
  if (args.existingUserId) {
    return args.existingUserId;
  }

  // Handle account linking
  if (args.profile.email) {
    const existingUser = await getByEmail(ctx, {
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
      ctx.db.insert("userSettings", {
        userId,
        theme: "system",
        groupQuestsBy: "dateAdded",
      });
      return userId;
    });
};

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Password({ reset: ResendOTPPasswordReset })],

  callbacks: {
    createOrUpdateUser,
    async redirect({ redirectTo }) {
      return redirectTo;
    },
  },
});
