import { describe, expect, it } from "vitest";
import type { FormData } from "#lib/forms/questions";
import download from "./download";

const [{ fill: fillBackgroundCheck }] = download.pdfs;

describe("Background Check Authorization of Release", () => {
  const testData: FormData = {
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

  it("sets purpose to 'Legal name change'", () => {
    const result = fillBackgroundCheck(testData);
    expect(result.nameChange).toBe("Legal name change");
  });

  it("includes new name in otherNames", () => {
    const result = fillBackgroundCheck(testData);
    expect(result.otherNames).toBe("Marsha P Johnson");
  });

  it("includes previous name in otherNames when present", () => {
    const result = fillBackgroundCheck({
      ...testData,
      previousNameFrom: "Former Name",
    });
    expect(result.otherNames).toBe("Former Name, Marsha P Johnson");
  });
});
