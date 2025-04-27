import type { PDFDefinition, PDFId } from "@/constants/forms";
import { getPdfDefinition } from "@/forms";
import { useEffect, useState } from "react";

/**
 * Given an array of PDF IDs, returns an array of objects with PDF details.
 * @param pdfIds - An array of PDF IDs.
 */
export function usePDFDetails(pdfIds: PDFId): PDFDefinition | null;
export function usePDFDetails(pdfIds: PDFId[]): PDFDefinition[] | null;
export function usePDFDetails(pdfIds: PDFId | PDFId[]) {
  const [pdfDetails, setPdfDetails] = useState<
    PDFDefinition | PDFDefinition[] | null
  >(null);

  useEffect(() => {
    const fetchPdfDefinitions = async () => {
      if (!pdfIds) return;

      if (Array.isArray(pdfIds)) {
        const pdfDefinitions = await Promise.all(pdfIds.map(getPdfDefinition));
        setPdfDetails(pdfDefinitions);
      } else {
        const pdfDefinition = await getPdfDefinition(pdfIds);
        setPdfDetails(pdfDefinition);
      }
    };
    fetchPdfDefinitions();
  }, [pdfIds]);

  return pdfDetails;
}
