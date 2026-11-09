import { describe, expect, it } from "vitest";
import { formatFieldValue } from "../formatReviewFields";

describe("formatFieldValue", () => {
  describe("boolean fields", () => {
    it("formats true as 'Yes'", () => {
      expect(formatFieldValue("isCurrentlyUnhoused", true)).toBe("Yes");
    });

    it("formats false as 'No'", () => {
      expect(formatFieldValue("isCurrentlyUnhoused", false)).toBe("No");
    });

    it("treats undefined as false and formats as 'No'", () => {
      expect(formatFieldValue("isCurrentlyUnhoused", undefined)).toBe("No");
    });

    it("treats null as false and formats as 'No'", () => {
      expect(formatFieldValue("isCurrentlyUnhoused", null)).toBe("No");
    });
  });

  describe("string fields", () => {
    it("formats string values", () => {
      expect(formatFieldValue("oldFirstName", "John")).toBe("John");
    });

    it("returns undefined for empty string", () => {
      expect(formatFieldValue("oldFirstName", "")).toBeUndefined();
    });

    it("returns undefined for undefined", () => {
      expect(formatFieldValue("oldFirstName", undefined)).toBeUndefined();
    });

    it("returns undefined for null", () => {
      expect(formatFieldValue("oldFirstName", null)).toBeUndefined();
    });
  });

  describe("string[] fields", () => {
    it("formats array of strings", () => {
      expect(formatFieldValue("pronouns", ["they/them", "she/her"])).toBe(
        "they/them, she/her",
      );
    });

    it("returns undefined for empty array", () => {
      expect(formatFieldValue("pronouns", [])).toBeUndefined();
    });

    it("returns undefined for undefined", () => {
      expect(formatFieldValue("pronouns", undefined)).toBeUndefined();
    });

    it("returns undefined for null", () => {
      expect(formatFieldValue("pronouns", null)).toBeUndefined();
    });

    it("returns undefined when value is not an array", () => {
      expect(formatFieldValue("pronouns", "they/them")).toBeUndefined();
    });
  });

  describe("phone number formatting", () => {
    it("formats phone number", () => {
      expect(formatFieldValue("phoneNumber", "(123) 456-7890")).toBe(
        "(123) 456-7890",
      );
    });

    it("returns undefined for empty phone number", () => {
      expect(formatFieldValue("phoneNumber", "")).toBeUndefined();
    });

    it("returns undefined for a falsy non-empty phone value", () => {
      // 0 bypasses the === "" early return but is still falsy inside formatPhoneNumber
      expect(formatFieldValue("phoneNumber", 0)).toBeUndefined();
    });
  });

  describe("date formatting", () => {
    it("formats ISO date string", () => {
      const result = formatFieldValue("dateOfBirth", "1990-01-15");
      expect(result).toBe("January 15, 1990");
    });

    it("returns undefined for empty date", () => {
      expect(formatFieldValue("dateOfBirth", "")).toBeUndefined();
    });

    it("returns undefined for a falsy non-empty date value", () => {
      // false bypasses the === "" early return but is still falsy inside formatDate
      expect(formatFieldValue("dateOfBirth", false)).toBeUndefined();
    });

    it("returns the raw value when the date string cannot be parsed", () => {
      expect(formatFieldValue("dateOfBirth", "not-a-date")).toBe("not-a-date");
    });
  });

  describe("currency formatting", () => {
    it("formats currency value", () => {
      const result = formatFieldValue("incomeAmount", 1234, { currency: true });
      expect(result).toBe("$1,234");
    });

    it("leaves amounts unformatted unless marked as currency", () => {
      expect(formatFieldValue("incomeAmount", 1234)).toBe("1234");
    });
  });

  describe("option labels", () => {
    it("shows the label of the stored value", () => {
      const options = { weekly: "Weekly", monthly: { label: "Monthly" } };
      expect(formatFieldValue("incomePeriod", "monthly", { options })).toBe(
        "Monthly",
      );
    });

    it("labels each value in a list", () => {
      const options = { asian: "Asian", black: "Black or African American" };
      expect(formatFieldValue("race", ["asian", "black"], { options })).toBe(
        "Asian, Black or African American",
      );
    });
  });

  describe("unknown field name", () => {
    it("coerces the value to a string", () => {
      // @ts-expect-error - testing with invalid field name
      expect(formatFieldValue("unknownField", 42)).toBe("42");
    });
  });
});
