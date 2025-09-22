import {
  type AuthFunctions,
  createClient,
  type GenericCtx,
} from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { Resend } from "resend";
import { DeleteAccountEmail } from "../emails/DeleteAccount";
import { ResetPasswordEmail } from "../emails/ResetPassword";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import * as AuthModel from "./model/authModel";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

const siteUrl = process.env.SITE_URL ?? "https://app.namesake.fyi";

const trustedOrigins = [
  "http://localhost:5173",
  process.env.SITE_URL ?? "https://app.namesake.fyi",
  process.env.CONVEX_CLOUD_URL ?? "https://api.namesake.fyi",
  process.env.CONVEX_SITE_URL ?? "https://actions.namesake.fyi",
];

const authFunctions: AuthFunctions = internal.auth;

export const authComponent = createClient<DataModel>(components.betterAuth, {
  authFunctions,
  triggers: {
    user: {
      onCreate: async (ctx, authUser) => {
        const userId = await AuthModel.createUser(ctx, {
          name: authUser.name,
          email: authUser.email,
          emailVerified: authUser.emailVerified,
        });

        // Facilitate migration to convex-better-auth 0.8
        await authComponent.setUserId(ctx, authUser._id, userId);
      },

      onUpdate: async (ctx, oldUser, newUser) => {
        await AuthModel.updateUser(ctx, {
          userId: oldUser._id,
          ...newUser,
          updatedAt: Date.now(),
        });
      },

      onDelete: async (ctx, authUser) => {
        await AuthModel.deleteUser(ctx, authUser._id);
      },
    },
  },
});

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false },
) => {
  return betterAuth({
    database: authComponent.adapter(ctx),
    plugins: [crossDomain({ siteUrl }), convex()],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      sendResetPassword: async ({ user, url }, _request) => {
        await resend.emails.send({
          from: "hey@namesake.fyi",
          to: user.email,
          subject: "Reset your password",
          react: ResetPasswordEmail({ email: user.email, url }),
        });
      },
    },
    logger: {
      // Reduce noise in the logs
      disabled: optionsOnly,
    },
    telemetry: { enabled: false },
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
};
