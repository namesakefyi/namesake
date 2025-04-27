import {
  AppContent,
  AppNav,
  AppSidebar,
  AppSidebarHeader,
} from "@/components/app";
import { QuestsNav } from "@/components/quests";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_home")({
  component: IndexRoute,
});

function IndexRoute() {
  const isMobile = useIsMobile();

  return (
    <div className="flex">
      {!isMobile && (
        <AppSidebar header={<AppSidebarHeader />} footer={<AppNav />}>
          <QuestsNav />
        </AppSidebar>
      )}
      <AppContent>
        <Outlet />
      </AppContent>
    </div>
  );
}
