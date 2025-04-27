import type { PDFDefinition, PDFId } from "@/constants/forms";
import { getPdfDefinition } from "@/forms";
import { useEffect, useState } from "react";

/**
 * Given a PDF ID, returns the PDF details.
 * @param pdfId - A single PDF ID.
 * @returns { data, errors }
 */
export function usePDFDetails(pdfId: PDFId): {
  data: PDFDefinition | null;
  errors: Error[];
} {
  const [data, setData] = useState<PDFDefinition | null>(null);
  const [errors, setErrors] = useState<Error[]>([]);

  useEffect(() => {
    let cancelled = false;
    const fetchPdfDefinition = async () => {
      if (!pdfId) {
        setData(null);
        setErrors([]);
        return;
      }
      try {
        const pdfDefinition = await getPdfDefinition(pdfId);
        if (!cancelled) {
          setData(pdfDefinition);
          setErrors([]);
        }
      } catch (err) {
        if (!cancelled) {
          setData(null);
          setErrors([err instanceof Error ? err : new Error(String(err))]);
        }
      }
    };
    fetchPdfDefinition();
    return () => {
      cancelled = true;
    };
  }, [pdfId]);

  return { data, errors };
}
