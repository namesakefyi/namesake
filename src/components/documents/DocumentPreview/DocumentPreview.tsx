import { Empty } from "@/components/common";
import type { PDFDefinition } from "@/constants";
import { useFilledPdf } from "@/hooks/useFilledPdf";
import { FileWarning } from "lucide-react";
import { useEffect, useRef } from "react";

interface DocumentPreviewProps {
  pdf: PDFDefinition;
}

export const DocumentPreview = ({ pdf }: DocumentPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const { pdfBytes, loading, error } = useFilledPdf(pdf);

  useEffect(() => {
    if (!loading && !error && pdfBytes && containerRef.current) {
      containerRef.current.innerHTML = "";
      const url = URL.createObjectURL(
        new Blob([pdfBytes], { type: "application/pdf" }),
      );
      const iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      iframe.style.display = "block";
      iframeRef.current = iframe;
      containerRef.current.appendChild(iframe);
    }
  }, [pdfBytes, loading, error]);

  if (loading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center">
        Loading PDF…
      </div>
    );
  }
  if (error) {
    return (
      <Empty
        icon={FileWarning}
        title="Error loading PDF"
        subtitle="Something went wrong."
      />
    );
  }

  return <div ref={containerRef} className="flex-1 w-full" />;
};
