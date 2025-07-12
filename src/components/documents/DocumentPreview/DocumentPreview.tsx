interface DocumentPreviewProps {
  pdfBytes: Uint8Array | null;
}

export const DocumentPreview = ({ pdfBytes }: DocumentPreviewProps) => {
  if (!pdfBytes) return;

  return (
    <iframe
      title="PDF Viewer"
      src={URL.createObjectURL(
        new Blob([pdfBytes], { type: "application/pdf" }),
      )}
      className="flex-1 size-full block"
      style={{
        width: "100%",
        height: "100%",
        border: "none",
      }}
    />
  );
};
