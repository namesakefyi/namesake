import type { FormPdf } from "#constants/pdf";
import { definePdf } from "../definePdf";

/** A one-page PDF shared across tests. */
export const testPdf = definePdf({
  title: "Test Form",
  canonicalUrl: "https://example.com",
  file: "public/forms/test-form.pdf",
  fields: {
    newFirstName: "text",
    oldFirstName: "text",
    shouldReturnOriginalDocuments: "checkbox",
  },
});

/** Fills `testPdf` from the answers of the same names. */
export const testFormPdf: FormPdf<typeof testPdf.fields> = {
  pdf: testPdf,
  fill: (data) => ({
    newFirstName: data.newFirstName,
    oldFirstName: data.oldFirstName,
    shouldReturnOriginalDocuments: data.shouldReturnOriginalDocuments,
  }),
};

/** A second PDF, for tests of multi-PDF packets. */
export const secondTestPdf = definePdf({
  title: "Test Form 2",
  canonicalUrl: "https://example.com",
  file: "public/forms/test-form-2.pdf",
  fields: { field1: "text" },
});

export const secondTestFormPdf: FormPdf<typeof secondTestPdf.fields> = {
  pdf: secondTestPdf,
  fill: (data) => ({ field1: data.newFirstName }),
};
