import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  AppContent,
  AppNav,
  AppSidebar,
  AppSidebarContent,
  AppSidebarFooter,
  AppSidebarHeader,
  NamesakeHeader,
} from "@/components/app";
import { SettingsNav } from "@/components/settings";
import { useIsMobile } from "@/hooks/useIsMobile";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsRoute,
});

function SettingsRoute() {
  const isMobile = useIsMobile();

  return (
    <div className="flex">
      {!isMobile && (
        <AppSidebar>
          <AppSidebarHeader>
            <NamesakeHeader />
          </AppSidebarHeader>
          <AppSidebarContent>
            <SettingsNav />
          </AppSidebarContent>
          <AppSidebarFooter>
            <AppNav />
          </AppSidebarFooter>
        </AppSidebar>
      )}
      <AppContent>
        <Outlet />
      </AppContent>
    </div>
  );
}
