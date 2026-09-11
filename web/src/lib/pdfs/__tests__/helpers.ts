import { definePdf } from "../definePdf";

/**
 * Shared test PDF definition used across multiple test files
 */
export const testPdfDefinition = definePdf({
  id: "test-form" as any,
  title: "Test Form",
  jurisdiction: "ma",
  canonicalUrl: "https://example.com",
  pdfPath: "public/forms/test-form.pdf",
  resolver: (data) => ({
    newFirstName: data.newFirstName,
    oldFirstName: data.oldFirstName,
    shouldReturnOriginalDocuments: data.shouldReturnOriginalDocuments,
  }),
});

/**
 * A second shared test PDF definition, for tests covering multi-PDF packets.
 */
export const secondTestPdfDefinition = definePdf({
  id: "test-form-2" as any,
  title: "Test Form 2",
  jurisdiction: "ma",
  canonicalUrl: "https://example.com",
  pdfPath: "public/forms/test-form-2.pdf",
  resolver: (data) => ({ field1: data.newFirstName }),
});
