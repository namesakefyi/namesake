import { describe, expect, it } from "vitest";
import { fullName } from "../fullName";

describe("fullName", () => {
  it("joins the group's names, skipping blanks", () => {
    expect(
      fullName(
        { parent1FirstName: "Marsha", parent1LastName: "Johnson" },
        "parent1Name",
      ),
    ).toBe("Marsha Johnson");
    expect(fullName({}, "oldName")).toBe("");
  });
});
