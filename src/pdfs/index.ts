import type { PDFDefinition, PDFId } from "../constants/pdf";

export async function getPdfDefinition(pdfId: PDFId) {
  const pdfModules = import.meta.glob(["/src/pdfs/!(utils)/**/index.ts"], {
    import: "default",
  });

  for (const path in pdfModules) {
    const mod = (await pdfModules[path]()) as unknown as PDFDefinition;
    if (mod.id === pdfId) {
      return mod;
    }
  }
  throw new Error("PDF not found");
}
