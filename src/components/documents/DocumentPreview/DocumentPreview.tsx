interface DocumentPreviewProps {
  pdfBytes: Uint8Array | null;
}

export const DocumentPreview = ({ pdfBytes }: DocumentPreviewProps) => {
  if (!pdfBytes) return;

  return (
    <div className="flex-1 w-full">
      <iframe
        title="PDF Viewer"
        src={URL.createObjectURL(
          new Blob([pdfBytes], { type: "application/pdf" }),
        )}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
      />
    </div>
  );
};
