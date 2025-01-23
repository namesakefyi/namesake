import { AppContent } from "@/components/app";
import { CoreQuestHeader } from "@/components/quests";
import { JURISDICTIONS, type Jurisdiction } from "@convex/constants";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_home/state-id/$jurisdiction",
)({
  beforeLoad: ({ params }) => {
    // If route is not a valid jurisdiction, redirect to base route
    if (
      !JURISDICTIONS[
        params.jurisdiction.toUpperCase() as keyof typeof JURISDICTIONS
      ]
    ) {
      throw redirect({ to: "/state-id" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { jurisdiction } = Route.useParams();

  return (
    <AppContent>
      <CoreQuestHeader
        type="state-id"
        badge={JURISDICTIONS[jurisdiction.toUpperCase() as Jurisdiction]}
      />
      <p>Not yet available.</p>
    </AppContent>
  );
}
