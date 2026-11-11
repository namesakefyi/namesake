import { describe, expect, it } from "vitest";
import { definePdf } from "../definePdf";

describe("definePdf", () => {
  it("returns the definition with its fields", () => {
    const definition = definePdf({
      title: "Test Form",
      canonicalUrl: "https://example.com",
      file: "public/forms/test-form.pdf",
      fields: { newFirstName: "text", isMinor: "checkbox" },
    });

    expect(definition).toEqual({
      title: "Test Form",
      canonicalUrl: "https://example.com",
      file: "public/forms/test-form.pdf",
      fields: { newFirstName: "text", isMinor: "checkbox" },
    });
  });
});
