import { AppContent } from "@/components/app";
import { JurisdictionInterstitial } from "@/components/quests";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_home/court-order/")({
  beforeLoad: async ({ context: { residence } }) => {
    if (residence) {
      throw redirect({
        to: "/$questSlug",
        params: {
          questSlug: `court-order-${residence.toLowerCase()}`,
        },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppContent>
      <JurisdictionInterstitial type="courtOrder" />
    </AppContent>
  );
}
