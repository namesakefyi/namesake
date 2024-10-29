import { Navigate, Outlet, createFileRoute } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";

export const Route = createFileRoute("/_unauthenticated")({
  component: UnauthenticatedRoute,
});

function UnauthenticatedRoute() {
  const { isAuthenticated } = useConvexAuth();

  if (isAuthenticated) return <Navigate to="/" />;

  return <Outlet />;
}
