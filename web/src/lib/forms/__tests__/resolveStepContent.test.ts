import { describe, expect, it } from "vitest";
import type { FormData } from "../questions";
import { nameOrFallback, resolveText } from "../resolveStepContent";

describe("nameOrFallback", () => {
  it("returns the name when newFirstName is a non-empty string", () => {
    expect(nameOrFallback({ newFirstName: "Erika" }, "the minor")).toBe(
      "Erika",
    );
  });

  it("returns the fallback when newFirstName is undefined", () => {
    expect(nameOrFallback({}, "the minor")).toBe("the minor");
  });

  it("returns the fallback when newFirstName is an empty string", () => {
    expect(nameOrFallback({ newFirstName: "" }, "the minor")).toBe("the minor");
  });

  it("returns the fallback when newFirstName is only whitespace", () => {
    expect(nameOrFallback({ newFirstName: "   " }, "the minor")).toBe(
      "the minor",
    );
  });
});

describe("resolveText", () => {
  it("returns plain text as is", () => {
    expect(resolveText("Legal Name", {})).toBe("Legal Name");
  });

  it("calls a text function with the form data", () => {
    const title = (data: FormData) => `Hello, ${data.newFirstName}`;
    expect(resolveText(title, { newFirstName: "Erika" })).toBe("Hello, Erika");
  });

  it("returns undefined when there's no text", () => {
    expect(resolveText(undefined, {})).toBeUndefined();
  });
});
