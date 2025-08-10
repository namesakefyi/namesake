import { useEffect, useMemo } from "react";

interface DocumentPreviewProps {
  pdfBytes: Uint8Array | null;
  hideDefaultToolbar?: boolean;
}

export const DocumentPreview = ({
  pdfBytes,
  hideDefaultToolbar = true,
}: DocumentPreviewProps) => {
  const pdfUrl = useMemo(() => {
    if (!pdfBytes) return null;

    const blobUrl = URL.createObjectURL(
      new Blob([pdfBytes as BlobPart], { type: "application/pdf" }),
    );

    const urlParams = hideDefaultToolbar ? "#toolbar=0&navpanes=0" : "";
    return blobUrl + urlParams;
  }, [pdfBytes, hideDefaultToolbar]);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        const cleanUrl = pdfUrl.split("#")[0];
        URL.revokeObjectURL(cleanUrl);
      }
    };
  }, [pdfUrl]);

  if (!pdfBytes || !pdfUrl) return null;

  return (
    <iframe
      title="PDF Viewer"
      src={pdfUrl}
      className="flex-1 size-full block"
      style={{
        width: "100%",
        height: "100%",
        border: "none",
      }}
    />
  );
};
