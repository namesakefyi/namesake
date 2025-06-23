import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AdminNav } from "@/components/admin";
import { PageHeader } from "@/components/app";
import { useIsMobile } from "@/hooks/useIsMobile";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminIndexRoute,
});

function AdminIndexRoute() {
  const isMobile = useIsMobile();

  if (!isMobile) return <Navigate to="/admin/quests" replace />;

  return (
    <>
      <PageHeader title="Admin" />
      <AdminNav className="app-padding" />
    </>
  );
}
