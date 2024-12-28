import { AppContent, PageHeader } from "@/components/app";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/browse/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppContent>
      <PageHeader title="Browse quests" />
    </AppContent>
  );
}
