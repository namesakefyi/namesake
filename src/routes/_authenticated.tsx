import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const isAuthenticated = await context.auth;
    if (!isAuthenticated) throw redirect({ to: "/signin" });
  },
  component: AuthenticatedRoute,
});

function AuthenticatedRoute() {
  return (
    <main className="text-gray-normal">
      <Outlet />
    </main>
  );
}
