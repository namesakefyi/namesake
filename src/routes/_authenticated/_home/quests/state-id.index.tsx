import { JurisdictionInterstitial } from "@/components/quests";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_home/quests/state-id/")({
  beforeLoad: async ({ context: { residence } }) => {
    if (residence) {
      throw redirect({
        to: "/quests/$questSlug",
        params: {
          questSlug: `state-id-${residence.toLowerCase()}`,
        },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <JurisdictionInterstitial type="stateId" />;
}
