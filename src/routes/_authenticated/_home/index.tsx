import { AppSidebarHeader } from "@/components/app";
import { QuestsNav } from "@/components/quests";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_home/")({
  component: IndexRoute,
});

function IndexRoute() {
  const isMobile = useIsMobile();

  if (!isMobile) return <Navigate to="/quests" replace />;

  return (
    <div className="flex flex-col py-7 gap-7 app-padding">
      <AppSidebarHeader />
      <QuestsNav />
    </div>
  );
}
