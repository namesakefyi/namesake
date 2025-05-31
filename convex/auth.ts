import "./polyfills";
import {
  type AuthFunctions,
  BetterAuth,
  convexAdapter,
} from "@erquhart/convex-better-auth";
import { convex, crossDomain } from "@erquhart/convex-better-auth/plugins";
import { betterAuth } from "better-auth";
import { Resend } from "resend";
import { DeleteAccountEmail } from "../emails/DeleteAccount";
import { ResetPasswordEmail } from "../emails/ResetPassword";
import { components, internal } from "./_generated/api";
import type { DataModel, Id } from "./_generated/dataModel";
import type { GenericCtx } from "./_generated/server";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

// Typesafe way to pass the functions below into the component
const authFunctions: AuthFunctions = internal.auth;

// Initialize the component
export const betterAuthComponent = new BetterAuth(
  components.betterAuth,
  authFunctions,
);

export const createAuth = (ctx: GenericCtx) =>
  betterAuth({
    database: convexAdapter(ctx, betterAuthComponent),
    trustedOrigins: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://modest-caterpillar-513.convex.cloud",
      "https://modest-caterpillar-513.convex.site",
      "https://app.namesake.fyi",
    ],
    plugins: [
      convex(), // Required
      crossDomain(), // Support client and Convex backend being on separate domains
    ],
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url }, _request) => {
        await resend.emails.send({
          from: "hey@namesake.fyi",
          to: user.email,
          subject: "Reset your password",
          react: ResetPasswordEmail({ email: user.email, url }),
        });
      },
    },
    user: {
      deleteUser: {
        enabled: true,
        sendDeleteAccountVerification: async ({ user, url }, _request) => {
          await resend.emails.send({
            from: "hey@namesake.fyi",
            to: user.email,
            subject: "Delete your account",
            react: DeleteAccountEmail({ email: user.email, url }),
          });
        },
      },
    },
  });

export const { createUser, updateUser, deleteUser, createSession } =
  betterAuthComponent.createAuthFunctions<DataModel>({
    onCreateUser: async (ctx, user) => {
      const id = await ctx.db.insert("users", {
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        role: "user",
      });

      // Initialize default user settings
      await ctx.db.insert("userSettings", {
        userId: id,
        theme: "system",
      });

      return id;
    },

    onUpdateUser: async (ctx, user) => {
      await ctx.db.patch(user.userId as Id<"users">, {
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
      });
    },

    onDeleteUser: async (ctx, userId) => {
      // Delete userQuests
      const userQuests = await ctx.db
        .query("userQuests")
        .withIndex("userId", (q) => q.eq("userId", userId as Id<"users">))
        .collect();
      for (const userQuest of userQuests) await ctx.db.delete(userQuest._id);

      // Delete userSettings
      const userSettings = await ctx.db
        .query("userSettings")
        .withIndex("userId", (q) => q.eq("userId", userId as Id<"users">))
        .first();
      if (userSettings) await ctx.db.delete(userSettings._id);

      // Finally, delete the user
      await ctx.db.delete(userId as Id<"users">);
    },
  });
