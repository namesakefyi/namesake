import { describe, expect, it } from "vitest";
import {
  getFieldNames,
  getFieldWhen,
  getFormFields,
  resolveFormVisibility,
} from "@/forms/formVisibility";
import { makeStep } from "./testHelpers";

describe("getFieldNames", () => {
  it("returns field names from a mix of strings and objects", () => {
    const fields = [
      "alwaysVisible",
      { id: "conditional", when: () => true },
      { ids: ["group1", "group2"], when: () => true },
    ] as any;
    expect(getFieldNames(fields)).toEqual([
      "alwaysVisible",
      "conditional",
      "group1",
      "group2",
    ]);
  });

  it("returns empty array for empty fields", () => {
    expect(getFieldNames([])).toEqual([]);
  });
});

describe("getFormFields", () => {
  it("flattens field names from all steps", () => {
    const steps = [makeStep("a", ["f1", "f2"]), makeStep("b", ["f3"])];
    expect(getFormFields(steps)).toEqual(["f1", "f2", "f3"]);
  });
});

describe("getFieldWhen", () => {
  it("returns null for a plain string field (unconditional)", () => {
    const fields = ["alwaysVisible"] as any;
    expect(getFieldWhen(fields, "alwaysVisible" as any)).toBeNull();
  });

  it("returns the when callback for a conditional field", () => {
    const when = () => true;
    const fields = [{ id: "conditional", when }] as any;
    expect(getFieldWhen(fields, "conditional" as any)).toBe(when);
  });

  it("returns the when callback for a field in a group", () => {
    const when = () => false;
    const fields = [{ ids: ["group1", "group2"], when }] as any;
    expect(getFieldWhen(fields, "group1" as any)).toBe(when);
    expect(getFieldWhen(fields, "group2" as any)).toBe(when);
  });

  it("returns undefined for a field not in the array", () => {
    expect(getFieldWhen(["other" as any], "missing" as any)).toBeUndefined();
  });
});

describe("resolveFormVisibility", () => {
  it("includes all steps and fields when no guards or when callbacks", () => {
    const steps = [
      makeStep("a", ["oldFirstName", "oldLastName"]),
      makeStep("b", ["phoneNumber"]),
    ];

    const result = resolveFormVisibility(steps, {
      oldFirstName: "Jane",
      oldLastName: "Doe",
      phoneNumber: "555",
    });

    expect(result.visibleStepIds).toEqual(["a", "b"]);
    expect(result.visibleFields).toEqual({
      oldFirstName: "Jane",
      oldLastName: "Doe",
      phoneNumber: "555",
    });
    expect(result.sections).toEqual([
      { stepId: "a", fields: ["oldFirstName", "oldLastName"] },
      { stepId: "b", fields: ["phoneNumber"] },
    ]);
  });

  it("excludes steps where guard returns false", () => {
    const steps = [
      makeStep("a", ["oldFirstName"]),
      makeStep("b", ["phoneNumber"], () => false),
    ];

    const result = resolveFormVisibility(steps, {
      oldFirstName: "Jane",
      phoneNumber: "555",
    });

    expect(result.visibleStepIds).toEqual(["a"]);
    expect(result.visibleFields).toEqual({ oldFirstName: "Jane" });
    expect(result.sections).toEqual([
      { stepId: "a", fields: ["oldFirstName"] },
    ]);
  });

  it("excludes fields where when returns false", () => {
    const steps = [
      makeStep("a", ["alwaysVisible", { id: "hidden", when: () => false }]),
    ];

    const result = resolveFormVisibility(steps, {
      alwaysVisible: "yes",
      hidden: "no",
    } as any);

    expect(result.visibleFields).toEqual({ alwaysVisible: "yes" });
    expect(result.sections).toEqual([
      { stepId: "a", fields: ["alwaysVisible"] },
    ]);
  });

  it("resolves PDF inclusion based on include predicates", () => {
    const steps = [makeStep("a")];
    const pdfs = [
      { pdfId: "always" as any },
      { pdfId: "conditional" as any, when: () => false },
    ];

    const result = resolveFormVisibility(steps, {}, pdfs);

    expect(result.pdfsToInclude).toEqual([
      { pdfId: "always", include: true },
      { pdfId: "conditional", include: false },
    ]);
  });

  it("handles grouped conditional fields", () => {
    const steps = [
      makeStep("a", [
        "trigger",
        { ids: ["dep1", "dep2"], when: (d: any) => d.trigger === true },
      ]),
    ];

    const visible = resolveFormVisibility(steps, { trigger: true } as any);
    expect(visible.visibleFields).toEqual({
      trigger: true,
      dep1: undefined,
      dep2: undefined,
    });
    expect(visible.sections[0].fields).toEqual(["trigger", "dep1", "dep2"]);

    const hidden = resolveFormVisibility(steps, { trigger: false } as any);
    expect(hidden.sections[0].fields).toEqual(["trigger"]);
  });
});
