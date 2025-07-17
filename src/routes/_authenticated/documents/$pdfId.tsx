import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { tv } from "tailwind-variants";
import { PageHeader } from "@/components/app";
import { Badge, Button } from "@/components/common";
import { DocumentPreview } from "@/components/documents";
import type { PDFId } from "@/constants/forms";
import { downloadPdf, fillPdf } from "@/forms/utils";
import { useDecryptedFormResponses } from "@/hooks/useDecryptedFormResponses";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePDFDetails } from "@/hooks/usePDFDetails";

export const Route = createFileRoute("/_authenticated/documents/$pdfId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { pdfId } = Route.useParams();
  const { data: pdf } = usePDFDetails(pdfId as PDFId);
  const {
    data: userData,
    isLoading: isLoadingUserData,
    error: userDataError,
  } = useDecryptedFormResponses();

  const isMobile = useIsMobile();
  const postHog = usePostHog();
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [isFillingPdf, setIsFillingPdf] = useState(false);

  useEffect(() => {
    if (!pdf || isLoadingUserData) return;

    const generatePdf = async () => {
      try {
        setIsFillingPdf(true);
        const result = await fillPdf({
          pdf,
          userData: userData || {},
        });
        setPdfBytes(result);
      } catch (error) {
        postHog.captureException(error);
        toast.error("Unable to load PDF document.");
      } finally {
        setIsFillingPdf(false);
      }
    };

    generatePdf();
  }, [pdf, userData, isLoadingUserData, postHog]);

  if (!pdf || isLoadingUserData || isFillingPdf) {
    return;
  }

  if (userDataError) {
    toast.error("We couldn't load your form responses.");
  }

  const badgeData = [];
  if (pdf.jurisdiction) badgeData.push(pdf.jurisdiction);
  if (pdf.code) badgeData.push(pdf.code);

  const badges =
    badgeData.length > 0 ? (
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

  const handleDownload = async () => {
    if (!pdfBytes) return;
    await downloadPdf({ pdfBytes, title: pdf.title });
  };

  return (
    <div className={styles({ isMobile })}>
      <PageHeader
        title={pdf.title ?? "Unknown Document"}
        badge={badges}
        mobileBackLink={{ to: "/documents" }}
        className="px-4 lg:px-6"
        fullWidth
      >
        <Button
          variant={isMobile ? "icon" : "secondary"}
          icon={Download}
          aria-label={isMobile ? "Download" : undefined}
          onClick={handleDownload}
          isDisabled={!pdfBytes}
        >
          {!isMobile && "Download"}
        </Button>
      </PageHeader>
      <DocumentPreview pdfBytes={pdfBytes} />
    </div>
  );
}
