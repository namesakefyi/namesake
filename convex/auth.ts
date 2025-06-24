import "./polyfills";
import {
  type AuthFunctions,
  BetterAuth,
  convexAdapter,
} from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { Resend } from "resend";
import { DeleteAccountEmail } from "../emails/DeleteAccount";
import { ResetPasswordEmail } from "../emails/ResetPassword";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import type { GenericCtx } from "./_generated/server";
import * as AuthModel from "./model/authModel";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

const siteUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5173"
    : process.env.CONVEX_SITE_URL || "https://api.namesake.fyi";

console.log("crossDomain siteUrl", siteUrl);

const trustedOrigins = [
  "http://localhost:5173",
  "https://app.namesake.fyi",
  process.env.CONVEX_CLOUD_URL || "https://api.namesake.fyi",
  process.env.CONVEX_SITE_URL || "https://convex.namesake.fyi",
];

console.log("trustedOrigins", trustedOrigins);

// Typesafe way to pass the functions below into the component
const authFunctions: AuthFunctions = internal.auth;

// Initialize the component
export const betterAuthComponent = new BetterAuth(components.betterAuth, {
  authFunctions,
});

export const createAuth = (ctx: GenericCtx) =>
  betterAuth({
    database: convexAdapter(ctx, betterAuthComponent),
    plugins: [convex(), crossDomain({ siteUrl })],
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
    trustedOrigins,
    user: {
      deleteUser: {
        enabled: true,
        sendDeleteAccountVerification: async ({ user, url }, _request) => {
          await resend.emails.send({
            from: "hey@namesake.fyi",
            to: user.email,
            subject: "Confirm account deletion",
            react: DeleteAccountEmail({ email: user.email, url }),
          });
        },
      },
    },
  });

export const { createUser, updateUser, deleteUser, createSession } =
  betterAuthComponent.createAuthFunctions<DataModel>({
    onCreateUser: AuthModel.createUser,
    onUpdateUser: AuthModel.updateUser,
    onDeleteUser: AuthModel.deleteUser,
  });
