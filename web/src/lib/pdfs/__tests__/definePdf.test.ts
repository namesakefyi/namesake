import { describe, expect, it } from "vitest";
import { definePdf } from "../definePdf";

describe("definePdf", () => {
  it("should create valid PDF definition", () => {
    const definition = definePdf({
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

    expect(definition).toMatchObject({
      id: "test-form",
      pdfPath: "public/forms/test-form.pdf",
      resolver: expect.any(Function),
    });
    const fields = definition.resolver({
      newFirstName: "New",
      oldFirstName: "Old",
      shouldReturnOriginalDocuments: true,
    });
    expect(fields.newFirstName).toBe("New");
    expect(fields.oldFirstName).toBe("Old");
  });
});
