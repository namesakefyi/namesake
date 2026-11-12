import type { FormPdf } from "#constants/forms";
import { definePdf } from "../definePdf";

type TestSchema = {
  readonly newFirstName: "text";
  readonly oldFirstName: "text";
  readonly shouldReturnOriginalDocuments: "checkbox";
};

/** A one-page PDF shared across tests. */
export const testPdf = definePdf<TestSchema>({
  title: "Test Form",
  canonicalUrl: "https://example.com",
  file: "public/forms/test-form.pdf",
});

/** Fills `testPdf` from the answers of the same names. */
export const testFormPdf: FormPdf<TestSchema> = {
  pdf: testPdf,
  fill: (data) => ({
    newFirstName: data.newFirstName,
    oldFirstName: data.oldFirstName,
    shouldReturnOriginalDocuments: data.shouldReturnOriginalDocuments,
  }),
};

/** A second PDF, for tests of multi-PDF packets. */
export const secondTestPdf = definePdf<{ readonly field1: "text" }>({
  title: "Test Form 2",
  canonicalUrl: "https://example.com",
  file: "public/forms/test-form-2.pdf",
});

export const secondTestFormPdf: FormPdf<{ readonly field1: "text" }> = {
  pdf: secondTestPdf,
  fill: (data) => ({ field1: data.newFirstName }),
};
