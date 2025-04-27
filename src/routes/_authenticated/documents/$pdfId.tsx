import { PageHeader } from "@/components/app";
import { Badge, Empty } from "@/components/common";
import { DocumentPreview } from "@/components/documents";
import type { PDFId } from "@/constants/forms";
import { usePDFDetails } from "@/hooks/usePDFDetails";
import { createFileRoute } from "@tanstack/react-router";
import { FileWarning } from "lucide-react";

export const Route = createFileRoute("/_authenticated/documents/$pdfId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { pdfId } = Route.useParams();
  const pdf = usePDFDetails(pdfId as PDFId);

  if (!pdf) {
    return <Empty icon={FileWarning} title="Couldn't find document" />;
  }

  const badgeData = [];
  if (pdf.jurisdiction) badgeData.push(pdf.jurisdiction);
  if (pdf.code) badgeData.push(pdf.code);

  const badges = badgeData ? (
    <div className="flex gap-1">
      {badgeData.map((badge) => (
        <Badge key={badge}>{badge}</Badge>
      ))}
    </div>
  ) : undefined;

  return (
    <div className="flex flex-col h-dvh flex-1">
      <PageHeader
        title={pdf.title ?? "Unknown Document"}
        badge={badges}
        mobileBackLink={{ to: "/documents" }}
      />
      <DocumentPreview pdf={pdf} />
    </div>
  );
}
