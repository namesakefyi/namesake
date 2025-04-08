import { AdminNav } from "@/components/admin";
import { PageHeader } from "@/components/app";
import { useIsMobile } from "@/utils/useIsMobile";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminIndexRoute,
});

function AdminIndexRoute() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (!isMobile) navigate({ to: "/admin/quests" });

  return (
    <>
      <PageHeader title="Admin" />
      <AdminNav />
    </>
  );
}
