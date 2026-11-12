import { describe, expect, it } from "vitest";
import type { FormData } from "../questions";
import { resolveText } from "../resolveText";

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
