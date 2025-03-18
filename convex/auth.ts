import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { createOrUpdateUser } from "./model/authModel";
import { ResendOTPPasswordReset } from "./passwordReset";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Password({ reset: ResendOTPPasswordReset })],

  callbacks: {
    createOrUpdateUser,
    async redirect({ redirectTo }) {
      return redirectTo;
    },
  },
});
