import { AppContent } from "@/components/app";
import { QuestsSidebar } from "@/components/quests";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Outlet, createFileRoute } from "@tanstack/react-router";

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
