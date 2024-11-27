import { Navigate, Outlet, createFileRoute } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedRoute,
});

function AuthenticatedRoute() {
  const { isAuthenticated } = useConvexAuth();

  if (!isAuthenticated) return <Navigate to="/signin" />;

  return (
    <main className="text-gray-normal">
      <Outlet />
    </main>
  );
}
