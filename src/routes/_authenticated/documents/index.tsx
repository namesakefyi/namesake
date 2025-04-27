import { PageHeader } from "@/components/app";
import { DocumentsNav } from "@/components/documents";
import { useIsMobile } from "@/hooks/useIsMobile";
import { api } from "@convex/_generated/api";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/_authenticated/documents/")({
  component: DocumentsIndexRoute,
});

function DocumentsIndexRoute() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const pdfIds = useQuery(api.userDocuments.list);
  const firstId = pdfIds?.[0]?.pdfId;

  if (!isMobile && firstId) {
    navigate({ to: "/documents/$pdfId", params: { pdfId: firstId } });
  }

  return (
    <>
      <PageHeader title="Documents" />
      <DocumentsNav className="app-padding" />
    </>
  );
}
