import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_unauthenticated")({
  component: UnauthenticatedRoute,
});

function UnauthenticatedRoute() {
  return <Outlet />;
}
