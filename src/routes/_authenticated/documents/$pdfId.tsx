import { PageHeader } from "@/components/app";
import { Badge, Button } from "@/components/common";
import { DocumentPreview } from "@/components/documents";
import type { PDFId } from "@/constants/forms";
import { usePDFDetails } from "@/hooks/usePDFDetails";
import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";

export const Route = createFileRoute("/_authenticated/documents/$pdfId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { pdfId } = Route.useParams();
  const pdfDetails = usePDFDetails(pdfId as PDFId);

  return (
    <>
      <PageHeader
        title={pdfDetails?.title ?? "Unknown Document"}
        badge={<Badge>{pdfDetails?.jurisdiction}</Badge>}
        mobileBackLink={{ to: "/documents" }}
      >
        {/* TODO: Add download, add preview, add code display */}
        {/* TODO: Does other metadata need to be saved to Convex? */}
        <Button size="small" icon={Download}>
          Fill and Download
        </Button>
      </PageHeader>
      <div className="app-padding">
        <DocumentPreview />
      </div>
    </>
  );
}
