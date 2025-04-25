import { JurisdictionInterstitial } from "@/components/quests";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_home/quests/court-order/")({
  beforeLoad: async ({ context: { residence } }) => {
    if (residence) {
      throw redirect({
        to: "/quests/$questSlug",
        params: {
          questSlug: `court-order-${residence.toLowerCase()}`,
        },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <JurisdictionInterstitial type="courtOrder" />;
}
