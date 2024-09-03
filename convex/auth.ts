import Resend from "@auth/core/providers/resend";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Resend],
});
