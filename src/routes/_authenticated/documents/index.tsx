import { AppContent, PageHeader } from "@/components/app";
import { Empty } from "@/components/common";
import { DocumentsNav } from "@/components/documents";
import { useIsMobile } from "@/hooks/useIsMobile";
import { api } from "@convex/_generated/api";
import { Navigate, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/_authenticated/documents/")({
  component: DocumentsIndexRoute,
});

function DocumentsIndexRoute() {
  const isMobile = useIsMobile();
  const pdfIds = useQuery(api.userDocuments.list);
  const firstId = pdfIds?.[0]?.pdfId;

  if (!isMobile && firstId) {
    return (
      <Navigate to="/documents/$pdfId" params={{ pdfId: firstId }} replace />
    );
  }

  if (pdfIds && pdfIds.length === 0) {
    return (
      <AppContent>
        <Empty
          title="No documents"
          icon={FileText}
          subtitle="Your documents will appear here after filling out forms."
          className="h-full"
        />
      </AppContent>
    );
  }

  return (
    <AppContent>
      <PageHeader title="Documents" />
      <DocumentsNav className="app-padding" />
    </AppContent>
  );
}
