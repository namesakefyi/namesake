import { describe, expect, it } from "vitest";
import { formatTitleWithJurisdiction } from "../formatTitleWithJurisdiction";

describe("formatTitleWithJurisdiction", () => {
  it("renders the title correctly with the jurisdiction", () => {
    expect(formatTitleWithJurisdiction("Court Order", "Massachusetts")).toEqual(
      "Massachusetts Court Order",
    );
  });

  it("renders the title correctly without the jurisdiction", () => {
    expect(formatTitleWithJurisdiction("Passport")).toEqual("Passport");
  });
});
