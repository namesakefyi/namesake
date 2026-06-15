import { describe, expect, it } from "vitest";
import { slugify } from "../slugify";

describe("slugify", () => {
  it("converts a basic question to a valid id", () => {
    expect(slugify("What is your name?")).toBe("what-is-your-name");
  });

  it("handles multiple punctuation marks", () => {
    expect(slugify("What is your name?!?")).toBe("what-is-your-name");
    expect(slugify("What is your name...")).toBe("what-is-your-name");
    expect(slugify("What is your name?!?...")).toBe("what-is-your-name");
  });

  it("handles apostrophes", () => {
    expect(slugify("What is your mother's name?")).toBe(
      "what-is-your-mothers-name",
    );
    expect(slugify("What's your name?")).toBe("whats-your-name");
  });

  it("handles multiple spaces", () => {
    // Multiple spaces between words should become a single hyphen
    expect(slugify("What   is   your    name?")).toBe("what-is-your-name");
    // Leading/trailing spaces should be trimmed
    expect(slugify(" What is your name? ")).toBe("what-is-your-name");
    // Tabs and newlines should be treated as spaces
    expect(slugify("What\tis\nyour\r\nname?")).toBe("what-is-your-name");
  });

  it("handles special characters", () => {
    expect(slugify("What is your name (legal name)?")).toBe(
      "what-is-your-name-legal-name",
    );
    expect(slugify("What is your name & address?")).toBe(
      "what-is-your-name-address",
    );
    expect(slugify("What is your name - full name?")).toBe(
      "what-is-your-name-full-name",
    );
  });

  it("handles numbers", () => {
    expect(slugify("What is your age (18+)?")).toBe("what-is-your-age-18");
    expect(slugify("Section 1: Personal Details")).toBe(
      "section-1-personal-details",
    );
  });

  it("handles empty or whitespace input", () => {
    expect(slugify("")).toBe("");
    expect(slugify(" ")).toBe("");
    expect(slugify("   ")).toBe("");
    expect(slugify("\t\n\r")).toBe("");
  });

  it("handles non-English characters", () => {
    expect(slugify("¿Cuál es tu nombre?")).toBe("cual-es-tu-nombre");
    expect(slugify("¿Qué edad tienes?")).toBe("que-edad-tienes");
    expect(slugify("What's your résumé?")).toBe("whats-your-resume");
    expect(slugify("Où habitez-vous?")).toBe("ou-habitez-vous");
    expect(slugify("Wie heißen Sie?")).toBe("wie-heissen-sie");
    expect(slugify("Qual é o seu nome?")).toBe("qual-e-o-seu-nome");
  });

  it("handles mixed case", () => {
    expect(slugify("What Is Your NAME?")).toBe("what-is-your-name");
    expect(slugify("WHAT IS YOUR NAME?")).toBe("what-is-your-name");
  });

  it("encodes special characters for URL safety", () => {
    expect(slugify("100% Complete?")).toBe("100-complete");
    expect(slugify("Q&A Section")).toBe("qa-section");
    expect(slugify("Test/Demo Form")).toBe("testdemo-form");
  });
});
