import {
  AppContent,
  AppNav,
  AppSidebar,
  AppSidebarHeader,
} from "@/components/app";
import { DocumentsNav } from "@/components/documents";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/documents")({
  component: DocumentsRoute,
});

function DocumentsRoute() {
  const isMobile = useIsMobile();

  return (
    <div className="flex">
      {!isMobile && (
        <AppSidebar header={<AppSidebarHeader />} footer={<AppNav />}>
          <DocumentsNav />
        </AppSidebar>
      )}
      <AppContent>
        <Outlet />
      </AppContent>
    </div>
  );
}
