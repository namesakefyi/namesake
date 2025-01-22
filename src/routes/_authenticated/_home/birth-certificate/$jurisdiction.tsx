import { AppContent, PageHeader } from "@/components/app";
import { Badge } from "@/components/common";
import { JURISDICTIONS } from "@convex/constants";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_home/birth-certificate/$jurisdiction",
)({
  beforeLoad: ({ params }) => {
    // If route is not a valid jurisdiction, redirect to base route
    if (
      !JURISDICTIONS[
        params.jurisdiction.toUpperCase() as keyof typeof JURISDICTIONS
      ]
    ) {
      throw redirect({ to: "/birth-certificate" });
    }
  },
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
      <p>Not yet available.</p>
    </AppContent>
  );
}
