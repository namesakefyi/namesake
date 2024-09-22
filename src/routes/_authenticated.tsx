import { AppHeader } from "@/components";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const auth = await context.auth;
    if (!auth.isAuthenticated) throw redirect({ to: "/login" });
  },
  component: AuthenticatedRoute,
});

function AuthenticatedRoute() {
  return (
    <main className="flex flex-col flex-1 min-h-screen text-gray-normal">
      <AppHeader />
      <Outlet />
    </main>
  );
}
