import { AppContent, PageHeader } from "@/components/app";
import { Badge } from "@/components/common";
import { JURISDICTIONS } from "@convex/constants";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_home/birth-certificate/$jurisdiction",
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
      <PageHeader title="Birth Certificate" badge={badge} />
    </AppContent>
  );
}
