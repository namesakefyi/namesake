import { AppContent, AppSidebar, AppSidebarHeader } from "@/components/app";
import { SettingsNav } from "@/components/settings";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsRoute,
});

function SettingsRoute() {
  const isMobile = useIsMobile();

  return (
    <div className="flex">
      {!isMobile && (
        <AppSidebar header={<AppSidebarHeader />}>
          <SettingsNav />
        </AppSidebar>
      )}
      <AppContent>
        <Outlet />
      </AppContent>
    </div>
  );
}
