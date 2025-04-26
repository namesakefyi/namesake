import { AppSidebarHeader } from "@/components/app";
import { QuestsNav } from "@/components/quests";
import { useIsMobile } from "@/hooks/useIsMobile";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_home/")({
  component: IndexRoute,
});

function IndexRoute() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (!isMobile) navigate({ to: "/quests/court-order" });

  return (
    <div className="flex flex-col py-7 gap-7 app-padding">
      <AppSidebarHeader />
      <QuestsNav />
    </div>
  );
}
