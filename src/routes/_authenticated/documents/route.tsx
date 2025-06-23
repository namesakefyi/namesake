import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
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

  return (
    <div className="flex">
      {!isMobile && (
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
      )}
      <Outlet />
    </div>
  );
}
