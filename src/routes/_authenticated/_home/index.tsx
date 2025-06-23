import { createFileRoute, Navigate } from "@tanstack/react-router";
import { QuestsSidebar } from "@/components/quests";
import { useIsMobile } from "@/hooks/useIsMobile";

export const Route = createFileRoute("/_authenticated/_home/")({
  component: IndexRoute,
});

function IndexRoute() {
  const isMobile = useIsMobile();

  if (!isMobile) return <Navigate to="/quests" replace />;

  return <QuestsSidebar />;
}
