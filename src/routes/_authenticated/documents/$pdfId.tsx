import { createFileRoute } from "@tanstack/react-router";
import { FileWarning } from "lucide-react";
import { tv } from "tailwind-variants";
import { PageHeader } from "@/components/app";
import { Badge, Empty } from "@/components/common";
import { DocumentPreview } from "@/components/documents";
import type { PDFId } from "@/constants/forms";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePDFDetails } from "@/hooks/usePDFDetails";

export const Route = createFileRoute("/_authenticated/documents/$pdfId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { pdfId } = Route.useParams();
  const { data } = usePDFDetails(pdfId as PDFId);
  const isMobile = useIsMobile();

  if (!data) {
    return <Empty icon={FileWarning} title="Couldn't find document" />;
  }

  const badgeData = [];
  if (data.jurisdiction) badgeData.push(data.jurisdiction);
  if (data.code) badgeData.push(data.code);

  const badges = badgeData ? (
    <div className="flex gap-1">
      {badgeData.map((badge) => (
        <Badge key={badge}>{badge}</Badge>
      ))}
    </div>
  ) : undefined;

  const styles = tv({
    base: "flex flex-col h-dvh flex-1",
    variants: {
      isMobile: {
        true: "h-full-minus-mobile-nav w-screen",
        false: "h-dvh",
      },
    },
  });

  return (
    <div className={styles({ isMobile })}>
      <PageHeader
        title={data.title ?? "Unknown Document"}
        badge={badges}
        mobileBackLink={{ to: "/documents" }}
      />
      <DocumentPreview pdf={data} />
    </div>
  );
}
