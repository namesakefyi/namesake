import { AppContent, PageHeader } from "@/components/app";
import { Badge } from "@/components/common";
import { JURISDICTIONS } from "@convex/constants";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_home/state-id/$jurisdiction",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { jurisdiction } = Route.useParams();

  const badge = (
    <Badge>
      {JURISDICTIONS[jurisdiction.toUpperCase() as keyof typeof JURISDICTIONS]}
    </Badge>
  );

  return (
    <AppContent>
      <PageHeader title="State ID" badge={badge} />
    </AppContent>
  );
}
