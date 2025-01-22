import { AppContent } from "@/components/app";
import { JurisdictionInterstitial } from "@/components/quests";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_home/birth-certificate/",
)({
  beforeLoad: async ({ context: { birthplace } }) => {
    if (birthplace) {
      throw redirect({
        to: "/birth-certificate/$jurisdiction",
        params: {
          jurisdiction: birthplace.toLowerCase(),
        },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppContent>
      <JurisdictionInterstitial type="birth-certificate" />
    </AppContent>
  );
}
