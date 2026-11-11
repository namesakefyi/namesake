import { describe, expect, it } from "vitest";
import { formatFieldValue } from "../formatReviewFields";

describe("formatFieldValue", () => {
  describe("bool fields", () => {
    it("formats true as 'Yes'", () => {
      expect(formatFieldValue("bool", true)).toBe("Yes");
    });

    it("formats false as 'No'", () => {
      expect(formatFieldValue("bool", false)).toBe("No");
    });

    it("treats undefined as false and formats as 'No'", () => {
      expect(formatFieldValue("bool", undefined)).toBe("No");
    });

    it("treats null as false and formats as 'No'", () => {
      expect(formatFieldValue("bool", null)).toBe("No");
    });
  });

  describe("text fields", () => {
    it("formats string values", () => {
      expect(formatFieldValue("text", "John")).toBe("John");
    });

    it("returns undefined for empty string", () => {
      expect(formatFieldValue("text", "")).toBeUndefined();
    });

    it("returns undefined for undefined", () => {
      expect(formatFieldValue("text", undefined)).toBeUndefined();
    });

    it("returns undefined for null", () => {
      expect(formatFieldValue("text", null)).toBeUndefined();
    });
  });

  describe("list fields", () => {
    it("formats array of strings", () => {
      expect(formatFieldValue("list", ["they/them", "she/her"])).toBe(
        "they/them, she/her",
      );
    });

    it("returns undefined for empty array", () => {
      expect(formatFieldValue("list", [])).toBeUndefined();
    });

    it("returns undefined for undefined", () => {
      expect(formatFieldValue("list", undefined)).toBeUndefined();
    });

    it("returns undefined for null", () => {
      expect(formatFieldValue("list", null)).toBeUndefined();
    });

    it("returns undefined when value is not an array", () => {
      expect(formatFieldValue("list", "they/them")).toBeUndefined();
    });
  });

  describe("phone number formatting", () => {
    it("formats phone number", () => {
      expect(formatFieldValue("phone", "(123) 456-7890")).toBe(
        "(123) 456-7890",
      );
    });

    it("returns undefined for empty phone number", () => {
      expect(formatFieldValue("phone", "")).toBeUndefined();
    });
  });

  describe("date formatting", () => {
    it("formats ISO date string", () => {
      const result = formatFieldValue("date", "1990-01-15");
      expect(result).toBe("January 15, 1990");
    });

    it("returns undefined for empty date", () => {
      expect(formatFieldValue("date", "")).toBeUndefined();
    });

    it("returns undefined for a falsy non-empty date value", () => {
      // false bypasses the === "" early return but is still falsy inside formatDate
      expect(formatFieldValue("date", false)).toBeUndefined();
    });

    it("returns the raw value when the date string cannot be parsed", () => {
      expect(formatFieldValue("date", "not-a-date")).toBe("not-a-date");
    });
  });

  describe("currency formatting", () => {
    it("formats currency value", () => {
      const result = formatFieldValue("number", 1234, { currency: true });
      expect(result).toBe("$1,234");
    });

    it("leaves amounts unformatted unless marked as currency", () => {
      expect(formatFieldValue("number", 1234)).toBe("1234");
    });
  });

  describe("option labels", () => {
    it("shows the label of the stored value", () => {
      const options = { weekly: "Weekly", monthly: { label: "Monthly" } };
      expect(formatFieldValue("oneOf", "monthly", { options })).toBe("Monthly");
    });

    it("labels each value in a list", () => {
      const options = { asian: "Asian", black: "Black or African American" };
      expect(formatFieldValue("list", ["asian", "black"], { options })).toBe(
        "Asian, Black or African American",
      );
    });
  });
});
