import { describe, expect, it } from "vitest";
import {
  nameOrFallback,
  resolveDescription,
  resolveTitle,
} from "../resolveStepContent";

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

describe("resolveTitle", () => {
  it("returns the title string directly when it is a string", () => {
    expect(resolveTitle({ title: "Legal Name" }, {})).toBe("Legal Name");
  });

  it("calls the title function with form data when it is a function", () => {
    const title = (data: any) => `Hello, ${data.newFirstName}`;
    expect(resolveTitle({ title }, { newFirstName: "Erika" })).toBe(
      "Hello, Erika",
    );
  });
});

describe("resolveDescription", () => {
  it("returns the description string directly when it is a string", () => {
    expect(resolveDescription({ description: "Some info" }, {})).toBe(
      "Some info",
    );
  });

  it("calls the description function with form data when it is a function", () => {
    const description = (data: any) => `Hi ${data.newFirstName}`;
    expect(resolveDescription({ description }, { newFirstName: "Erika" })).toBe(
      "Hi Erika",
    );
  });

  it("returns undefined when description is not set", () => {
    expect(resolveDescription({}, {})).toBeUndefined();
  });
});
