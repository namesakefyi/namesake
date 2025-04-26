import { describe, expect, it } from "vitest";
import { joinNames, joinPronouns } from "../pdf-helpers";

describe("PDF helpers", () => {
  describe("joinNames", () => {
    it("joins all name parts when present", () => {
      expect(joinNames("John", "Robert", "Doe")).toBe("John Robert Doe");
    });

    it("handles missing middle name", () => {
      expect(joinNames("John", undefined, "Doe")).toBe("John Doe");
    });

    it("handles missing first name", () => {
      expect(joinNames(undefined, "Robert", "Doe")).toBe("Robert Doe");
    });

    it("handles missing last name", () => {
      expect(joinNames("John", "Robert", undefined)).toBe("John Robert");
    });

    it("handles only first name", () => {
      expect(joinNames("John", undefined, undefined)).toBe("John");
    });

    it("handles only middle name", () => {
      expect(joinNames(undefined, "Robert", undefined)).toBe("Robert");
    });

    it("handles only last name", () => {
      expect(joinNames(undefined, undefined, "Doe")).toBe("Doe");
    });

    it("handles all undefined values", () => {
      expect(joinNames(undefined, undefined, undefined)).toBe("");
    });
  });

  describe("joinPronouns", () => {
    it("joins primary and other pronouns when both present", () => {
      expect(joinPronouns("She/Her", "They/Them")).toBe("She/Her, They/Them");
    });

    it("returns only primary pronouns when other pronouns undefined", () => {
      expect(joinPronouns("She/Her", undefined)).toBe("She/Her");
    });

    it("returns only other pronouns when primary pronouns undefined", () => {
      expect(joinPronouns(undefined, "They/Them")).toBe("They/Them");
    });

    it("handles both pronouns undefined", () => {
      expect(joinPronouns(undefined, undefined)).toBe("");
    });

    it("handles empty strings", () => {
      expect(joinPronouns("", "")).toBe("");
    });

    it("handles mix of empty string and undefined", () => {
      expect(joinPronouns("", undefined)).toBe("");
      expect(joinPronouns(undefined, "")).toBe("");
    });
  });
});
