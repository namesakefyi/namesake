import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminNav } from "@/components/admin";
import {
  AppContent,
  AppDesktopWrapper,
  AppNav,
  AppSidebar,
  AppSidebarContent,
  AppSidebarFooter,
  AppSidebarHeader,
  NamesakeHeader,
} from "@/components/app";
import { useIsMobile } from "@/hooks/useIsMobile";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: ({ context }) => {
    const isAdmin = context.role === "admin";

    if (!isAdmin) {
      throw redirect({
        to: "/",
        statusCode: 401,
        replace: true,
      });
    }
  },
  component: AdminRoute,
});

function AdminRoute() {
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
      <AppSidebar>
        <AppSidebarHeader>
          <NamesakeHeader />
        </AppSidebarHeader>
        <AppSidebarContent>
          <AdminNav />
        </AppSidebarContent>
        <AppSidebarFooter>
          <AppNav />
        </AppSidebarFooter>
      </AppSidebar>
      <AppContent>
        <Outlet />
      </AppContent>
    </AppDesktopWrapper>
  );
}
