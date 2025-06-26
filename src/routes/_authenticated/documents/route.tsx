import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  AppDesktopWrapper,
  AppNav,
  AppSidebar,
  AppSidebarContent,
  AppSidebarFooter,
  AppSidebarHeader,
  NamesakeHeader,
} from "@/components/app";
import { DocumentsNav } from "@/components/documents";
import { useIsMobile } from "@/hooks/useIsMobile";

export const Route = createFileRoute("/_authenticated/documents")({
  component: DocumentsRoute,
});

function DocumentsRoute() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <Outlet />;
  }

  return (
    <AppDesktopWrapper>
      <AppSidebar>
        <AppSidebarHeader>
          <NamesakeHeader />
        </AppSidebarHeader>
        <AppSidebarContent>
          <DocumentsNav />
        </AppSidebarContent>
        <AppSidebarFooter>
          <AppNav />
        </AppSidebarFooter>
      </AppSidebar>

      <Outlet />
    </AppDesktopWrapper>
  );
}
