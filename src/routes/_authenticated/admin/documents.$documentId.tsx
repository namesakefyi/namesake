import { PageHeader } from "@/components/app";
import { Badge } from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";

export const Route = createFileRoute(
  "/_authenticated/admin/documents/$documentId",
)({
  component: AdminDocumentDetailRoute,
});

function AdminDocumentDetailRoute() {
  const { documentId } = Route.useParams();
  const document = useQuery(api.documents.getById, {
    documentId: documentId as Id<"documents">,
  });
  const fileUrl = useQuery(api.documents.getURL, {
    documentId: documentId as Id<"documents">,
  });

  if (document === undefined) return;
  if (document === null) return "Document not found";

  return (
    <div>
      <PageHeader
        title={document.title}
        badge={<Badge size="lg">{document.code}</Badge>}
      />
      {fileUrl && (
        <object
          className="w-full aspect-square max-h-full rounded-lg"
          data={fileUrl}
          title={document.title}
        />
      )}
    </div>
  );
}
