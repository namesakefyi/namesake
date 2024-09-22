import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_unauthenticated")({
  beforeLoad: async ({ context }) => {
    const auth = await context.auth;
    // If already authenticated, redirect to dashboard
    if (auth.isAuthenticated) throw redirect({ to: "/" });
  },
  component: UnauthenticatedRoute,
});

function UnauthenticatedRoute() {
  return <Outlet />;
}
