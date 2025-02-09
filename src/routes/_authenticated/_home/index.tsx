import { AppContent, PageHeader } from "@/components/app";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_home/")({
  component: IndexRoute,
});

function IndexRoute() {
  return (
    <AppContent>
      <PageHeader title="Home" />
    </AppContent>
  );
}
