import { JurisdictionInterstitial } from "@/components/quests";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_home/birth-certificate/",
)({
  beforeLoad: async ({ context: { birthplace } }) => {
    if (birthplace) {
      throw redirect({
        to: "/quests/$questSlug",
        params: {
          questSlug: `birth-certificate-${birthplace.toLowerCase()}`,
        },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <JurisdictionInterstitial type="birthCertificate" />;
}
