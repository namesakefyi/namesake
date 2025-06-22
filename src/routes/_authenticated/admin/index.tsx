import { AdminNav } from "@/components/admin";
import { PageHeader } from "@/components/app";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminIndexRoute,
});

function AdminIndexRoute() {
  const isMobile = useIsMobile();

  if (!isMobile) return <Navigate to="/admin/quests" replace />;

  return (
    <>
      <PageHeader title="Admin" />
      <AdminNav />
    </>
  );
}
