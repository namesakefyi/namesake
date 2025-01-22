import { AppContent, PageHeader } from "@/components/app";
import { Badge } from "@/components/common";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_home/passport/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppContent>
      <PageHeader title="Passport" badge={<Badge>US</Badge>} />
      <p>Not yet available.</p>
    </AppContent>
  );
}
