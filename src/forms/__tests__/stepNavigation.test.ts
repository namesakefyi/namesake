import { describe, expect, it } from "vitest";
import { findNextStepIndex, findPrevStepIndex } from "@/forms/formVisibility";
import { makeStep } from "./testHelpers";

describe("findNextStepIndex", () => {
  const steps = [makeStep("a"), makeStep("b"), makeStep("c")];
  const allVisible = ["a", "b", "c"];

  it("returns the immediate next index when all steps visible", () => {
    expect(findNextStepIndex(steps, 0, allVisible)).toBe(1);
    expect(findNextStepIndex(steps, 1, allVisible)).toBe(2);
  });

  it("returns -1 when already at the last step", () => {
    expect(findNextStepIndex(steps, 2, allVisible)).toBe(-1);
  });

  it("skips steps not in visibleStepIds", () => {
    expect(findNextStepIndex(steps, 0, ["a", "c"])).toBe(2);
  });

  it("returns -1 when all remaining steps are hidden", () => {
    expect(findNextStepIndex(steps, 0, ["a"])).toBe(-1);
  });
});

describe("findPrevStepIndex", () => {
  const steps = [makeStep("a"), makeStep("b"), makeStep("c")];
  const allVisible = ["a", "b", "c"];

  it("returns the immediate previous index when all steps visible", () => {
    expect(findPrevStepIndex(steps, 2, allVisible)).toBe(1);
    expect(findPrevStepIndex(steps, 1, allVisible)).toBe(0);
  });

  it("returns -1 when already at the first step", () => {
    expect(findPrevStepIndex(steps, 0, allVisible)).toBe(-1);
  });

  it("skips steps not in visibleStepIds", () => {
    expect(findPrevStepIndex(steps, 2, ["a", "c"])).toBe(0);
  });

  it("returns -1 when all preceding steps are hidden", () => {
    expect(findPrevStepIndex(steps, 2, ["c"])).toBe(-1);
  });
});
