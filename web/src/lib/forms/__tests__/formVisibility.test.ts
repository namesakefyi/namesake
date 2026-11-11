import { describe, expect, it } from "vitest";
import { secondTestFormPdf, testFormPdf } from "#lib/pdfs/__tests__/helpers";
import { getFormFields, resolveFormVisibility } from "../formVisibility";
import { makeStep } from "./testHelpers";

/** Each visible section as its step ID and the IDs of its visible fields. */
function sectionIds({ sections }: ReturnType<typeof resolveFormVisibility>) {
  return sections.map(({ step, fields }) => ({
    stepId: step.id,
    fields: fields.map((field) => field.id),
  }));
}

describe("getFormFields", () => {
  it("flattens field names from all steps", () => {
    const steps = [makeStep("a", ["f1", "f2"]), makeStep("b", ["f3"])];
    expect(getFormFields(steps)).toEqual(["f1", "f2", "f3"]);
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
    expect(sectionIds(result)).toEqual([
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
    expect(sectionIds(result)).toEqual([
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
    expect(sectionIds(result)).toEqual([
      { stepId: "a", fields: ["alwaysVisible"] },
    ]);
  });

  it("includes only PDFs whose `when` passes", () => {
    const steps = [makeStep("a")];
    const conditional = { ...secondTestFormPdf, when: () => false };

    const result = resolveFormVisibility(steps, {}, [testFormPdf, conditional]);

    expect(result.includedPdfs).toEqual([testFormPdf]);
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
    expect(sectionIds(visible)[0].fields).toEqual(["trigger", "dep1", "dep2"]);

    const hidden = resolveFormVisibility(steps, { trigger: false } as any);
    expect(sectionIds(hidden)[0].fields).toEqual(["trigger"]);
  });
});
