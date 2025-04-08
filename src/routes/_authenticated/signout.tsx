import { useAuthActions } from "@convex-dev/auth/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/signout")({
  component: RouteComponent,
});

async function RouteComponent() {
  const navigate = useNavigate();
  const { signOut } = useAuthActions();

  await signOut();
  navigate({ to: "/signin" });
}
