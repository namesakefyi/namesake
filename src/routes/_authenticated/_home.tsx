import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppContent } from "@/components/app";
import { QuestsSidebar } from "@/components/quests";
import { useIsMobile } from "@/hooks/useIsMobile";

export const Route = createFileRoute("/_authenticated/_home")({
  component: IndexRoute,
});

function IndexRoute() {
  const isMobile = useIsMobile();

  return (
    <div className="flex">
      {!isMobile && <QuestsSidebar />}
      <AppContent>
        <Outlet />
      </AppContent>
    </div>
  );
}
