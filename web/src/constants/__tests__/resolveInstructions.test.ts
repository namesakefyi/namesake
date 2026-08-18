import { describe, expect, it } from "vitest";
import { type Instruction, resolveInstructions } from "../forms";

describe("resolveInstructions", () => {
  it("includes plain string instructions unconditionally", () => {
    expect(resolveInstructions(["Do this", "Do that"], {})).toEqual([
      "Do this",
      "Do that",
    ]);
  });

  it("includes a conditional instruction when its predicate returns true", () => {
    const instructions = ["Always", { text: "Conditional", when: () => true }];

    expect(resolveInstructions(instructions, {})).toEqual([
      "Always",
      "Conditional",
    ]);
  });

  it("excludes a conditional instruction when its predicate returns false", () => {
    const instructions = ["Always", { text: "Conditional", when: () => false }];

    expect(resolveInstructions(instructions, {})).toEqual(["Always"]);
  });

  it("evaluates each predicate against the given form data", () => {
    const instructions: Instruction[] = [
      { text: "Has first name", when: (data) => !!data.oldFirstName },
    ];

    expect(resolveInstructions(instructions, { oldFirstName: "Jane" })).toEqual(
      ["Has first name"],
    );
    expect(resolveInstructions(instructions, {})).toEqual([]);
  });
});
