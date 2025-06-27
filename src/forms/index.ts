import type { PDFDefinition, PDFId } from "@/constants/forms";

export async function getPdfDefinition(pdfId: PDFId) {
  const pdfModules = import.meta.glob("/src/forms/*/!(*.test|utils).ts", {
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
