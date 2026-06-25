import { describe, expect, it } from "vitest";
import type { FormData } from "#constants/fields";
import { expectPdfFieldsMatch } from "#lib/pdfs/expectPdfFieldsMatch";
import backgroundCheckAuthorizationOfRelease from ".";

describe("Background Check Authorization of Release", () => {
  const testData: Partial<FormData> = {
    oldFirstName: "My",
    oldMiddleName: "Old",
    oldLastName: "Name",
    newFirstName: "Marsha",
    newMiddleName: "P",
    newLastName: "Johnson",
    dateOfBirth: "1970-01-01",
    residenceStreetAddress: "100 Main St",
    residenceCity: "Providence",
    residenceState: "RI",
    residenceZipCode: "02903",
  };

  it("maps all fields correctly to the PDF", async () => {
    await expectPdfFieldsMatch(backgroundCheckAuthorizationOfRelease, testData);
  });

  it("sets purpose to 'Legal name change'", () => {
    const result = backgroundCheckAuthorizationOfRelease.resolver(testData);
    expect(result.nameChange).toBe("Legal name change");
  });

  it("includes new name in otherNames", () => {
    const result = backgroundCheckAuthorizationOfRelease.resolver(testData);
    expect(result.otherNames).toBe("Marsha P Johnson");
  });

  it("includes previous name in otherNames when present", () => {
    const result = backgroundCheckAuthorizationOfRelease.resolver({
      ...testData,
      previousNameFrom: "Former Name",
    });
    expect(result.otherNames).toBe("Former Name, Marsha P Johnson");
  });
});
