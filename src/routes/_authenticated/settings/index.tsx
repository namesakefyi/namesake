import { PageHeader } from "@/components/app";
import { SettingsNav } from "@/components/settings";
import { useIsMobile } from "@/utils/useIsMobile";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings/")({
  component: SettingsIndexRoute,
});

function SettingsIndexRoute() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (!isMobile) navigate({ to: "/settings/account" });

  return (
    <>
      <PageHeader
        title="Settings"
        backLink={isMobile ? { to: "/" } : undefined}
      />
      <SettingsNav />
    </>
  );
}
