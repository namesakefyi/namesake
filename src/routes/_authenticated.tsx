import { AppHeader } from "@/components";
import { Navigate, Outlet, createFileRoute } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedRoute,
});

function AuthenticatedRoute() {
  const { isAuthenticated } = useConvexAuth();

  if (!isAuthenticated) return <Navigate to="/signin" />;

  return (
    <main className="flex flex-col h-screen text-gray-normal">
      <AppHeader />
      <Outlet />
    </main>
  );
}
