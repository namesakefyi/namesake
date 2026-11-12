import { describe, expect, it } from "vitest";
import { definePdf } from "../definePdf";

describe("definePdf", () => {
  it("returns the definition as given", () => {
    const definition = definePdf<{ readonly newFirstName: "text" }>({
      title: "Test Form",
      canonicalUrl: "https://example.com",
      file: "public/forms/test-form.pdf",
    });

    expect(definition).toEqual({
      title: "Test Form",
      canonicalUrl: "https://example.com",
      file: "public/forms/test-form.pdf",
    });
  });
});
