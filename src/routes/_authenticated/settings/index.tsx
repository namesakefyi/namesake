import { createFileRoute, Navigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/app";
import { SettingsNav } from "@/components/settings";
import { useIsMobile } from "@/hooks/useIsMobile";

export const Route = createFileRoute("/_authenticated/settings/")({
  component: SettingsIndexRoute,
});

function SettingsIndexRoute() {
  const isMobile = useIsMobile();

  if (!isMobile) return <Navigate to="/settings/account" replace />;

  return (
    <>
      <PageHeader title="Settings" />
      <SettingsNav className="app-padding" />
    </>
  );
}
