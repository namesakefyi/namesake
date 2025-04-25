import { describe, expect, it } from "vitest";
import { getFormSectionId } from "./getFormSectionId";

describe("getFormSectionId", () => {
  it("converts a basic question to a valid id", () => {
    expect(getFormSectionId("What is your name?")).toBe("what-is-your-name");
  });

  it("handles multiple punctuation marks", () => {
    expect(getFormSectionId("What is your name?!?")).toBe("what-is-your-name");
    expect(getFormSectionId("What is your name...")).toBe("what-is-your-name");
    expect(getFormSectionId("What is your name?!?...")).toBe(
      "what-is-your-name",
    );
  });

  it("handles apostrophes", () => {
    expect(getFormSectionId("What is your mother's name?")).toBe(
      "what-is-your-mothers-name",
    );
    expect(getFormSectionId("What's your name?")).toBe("whats-your-name");
  });

  it("handles multiple spaces", () => {
    // Multiple spaces between words should become a single hyphen
    expect(getFormSectionId("What   is   your    name?")).toBe(
      "what-is-your-name",
    );
    // Leading/trailing spaces should be trimmed
    expect(getFormSectionId(" What is your name? ")).toBe("what-is-your-name");
    // Tabs and newlines should be treated as spaces
    expect(getFormSectionId("What\tis\nyour\r\nname?")).toBe(
      "what-is-your-name",
    );
  });

  it("handles special characters", () => {
    expect(getFormSectionId("What is your name (legal name)?")).toBe(
      "what-is-your-name-legal-name",
    );
    expect(getFormSectionId("What is your name & address?")).toBe(
      "what-is-your-name-address",
    );
    expect(getFormSectionId("What is your name - full name?")).toBe(
      "what-is-your-name-full-name",
    );
  });

  it("handles numbers", () => {
    expect(getFormSectionId("What is your age (18+)?")).toBe(
      "what-is-your-age-18",
    );
    expect(getFormSectionId("Section 1: Personal Details")).toBe(
      "section-1-personal-details",
    );
  });

  it("handles empty or whitespace input", () => {
    expect(getFormSectionId("")).toBe("");
    expect(getFormSectionId(" ")).toBe("");
    expect(getFormSectionId("   ")).toBe("");
    expect(getFormSectionId("\t\n\r")).toBe("");
  });

  it("handles non-English characters", () => {
    expect(getFormSectionId("¿Cuál es tu nombre?")).toBe("cual-es-tu-nombre");
    expect(getFormSectionId("¿Qué edad tienes?")).toBe("que-edad-tienes");
    expect(getFormSectionId("What's your résumé?")).toBe("whats-your-resume");
    expect(getFormSectionId("Où habitez-vous?")).toBe("ou-habitez-vous");
    expect(getFormSectionId("Wie heißen Sie?")).toBe("wie-heissen-sie");
    expect(getFormSectionId("Qual é o seu nome?")).toBe("qual-e-o-seu-nome");
  });

  it("handles mixed case", () => {
    expect(getFormSectionId("What Is Your NAME?")).toBe("what-is-your-name");
    expect(getFormSectionId("WHAT IS YOUR NAME?")).toBe("what-is-your-name");
  });

  it("encodes special characters for URL safety", () => {
    expect(getFormSectionId("100% Complete?")).toBe("100-complete");
    expect(getFormSectionId("Q&A Section")).toBe("qa-section");
    expect(getFormSectionId("Test/Demo Form")).toBe("testdemo-form");
  });
});
