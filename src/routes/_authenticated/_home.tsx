import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppContent, AppDesktopWrapper } from "@/components/app";
import { QuestsSidebar } from "@/components/quests";
import { useIsMobile } from "@/hooks/useIsMobile";

export const Route = createFileRoute("/_authenticated/_home")({
  component: IndexRoute,
});

function IndexRoute() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <AppContent>
        <Outlet />
      </AppContent>
    );
  }

  return (
    <AppDesktopWrapper>
      <QuestsSidebar />
      <AppContent>
        <Outlet />
      </AppContent>
    </AppDesktopWrapper>
  );
}
