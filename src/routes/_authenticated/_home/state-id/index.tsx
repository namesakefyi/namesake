import { AppContent } from "@/components/app";
import { JurisdictionInterstitial } from "@/components/quests";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_home/state-id/")({
  beforeLoad: async ({ context: { residence } }) => {
    if (residence) {
      throw redirect({
        to: "/state-id/$jurisdiction",
        params: {
          jurisdiction: residence.toLowerCase(),
        },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppContent>
      <JurisdictionInterstitial type="state-id" />
    </AppContent>
  );
}
