import { AppContent } from "@/components/app";
import { CoreQuestHeader } from "@/components/quests";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_home/social-security/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppContent>
      <CoreQuestHeader type="social-security" badge="United States" />
      <p>Not yet available.</p>
    </AppContent>
  );
}
