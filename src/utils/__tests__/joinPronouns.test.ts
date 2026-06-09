import { describe, expect, it } from "vitest";
import { joinPronouns } from "../joinPronouns";

describe("joinPronouns", () => {
  it("joins primary and other pronouns when both present", () => {
    expect(joinPronouns(["She/Her"], "They/Them")).toBe("She/Her, They/Them");
  });

  it("returns only primary pronouns when other pronouns undefined", () => {
    expect(joinPronouns(["She/Her"], undefined)).toBe("She/Her");
  });

  it("returns only other pronouns when primary pronouns undefined", () => {
    expect(joinPronouns(undefined, "They/Them")).toBe("They/Them");
  });

  it("handles both pronouns undefined", () => {
    expect(joinPronouns(undefined, undefined)).toBe("");
  });

  it("handles empty strings", () => {
    expect(joinPronouns([], "")).toBe("");
  });

  it("handles mix of empty string and undefined", () => {
    expect(joinPronouns([], undefined)).toBe("");
    expect(joinPronouns(undefined, "")).toBe("");
  });

  it("excludes the literal 'Other' entry and uses otherPronouns instead", () => {
    expect(joinPronouns(["She/Her", "Other"], "Ze/Zir")).toBe(
      "She/Her, Ze/Zir",
    );
    expect(joinPronouns(["Other"], "Ze/Zir")).toBe("Ze/Zir");
  });
});
