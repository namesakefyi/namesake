import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/beta/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/admin/beta/"!</div>;
}
