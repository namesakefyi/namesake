import { waitFor } from "@/utils/waitFor";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { usePostHog } from "posthog-js/react";
import { useRef } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/signout")({
  component: RouteComponent,
});

async function RouteComponent() {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const postHog = usePostHog();

  const isSignedIn = useQuery(api.users.isSignedIn);
  const isSignedInRef = useRef(isSignedIn);
  isSignedInRef.current = isSignedIn;

  try {
    await signOut();
    // Wait for user sign out to complete before redirecting
    await waitFor(() => isSignedInRef.current === false);
    navigate({ to: "/signin" });
  } catch (error) {
    toast.error(`Couldn't sign out. ${error}`);
    postHog.captureException(error);
  }
}
