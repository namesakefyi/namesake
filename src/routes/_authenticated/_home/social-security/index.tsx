import { AppContent, PageHeader } from "@/components/app";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_home/social-security/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppContent>
      <PageHeader title="Social Security" />
    </AppContent>
  );
}
