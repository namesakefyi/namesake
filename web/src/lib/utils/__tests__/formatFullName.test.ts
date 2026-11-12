import { describe, expect, it } from "vitest";
import { formatFullName } from "../formatFullName";

describe("formatFullName", () => {
  it("joins the group's names, skipping blanks", () => {
    expect(
      formatFullName(
        { parent1FirstName: "Marsha", parent1LastName: "Johnson" },
        "parent1Name",
      ),
    ).toBe("Marsha Johnson");
    expect(formatFullName({}, "oldName")).toBe("");
  });
});
