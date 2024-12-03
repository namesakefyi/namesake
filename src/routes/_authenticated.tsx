import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { Authenticated } from "convex/react";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const { isAuthenticated, isLoading } = await context.auth;
    if (!isLoading && !isAuthenticated) throw redirect({ to: "/signin" });
  },
  component: AuthenticatedRoute,
});

function AuthenticatedRoute() {
  return (
    <Authenticated>
      <main className="text-gray-normal">
        <Outlet />
      </main>
    </Authenticated>
  );
}
