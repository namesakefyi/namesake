import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_home/")({
  component: IndexRoute,
});

function IndexRoute() {
  return;
}
