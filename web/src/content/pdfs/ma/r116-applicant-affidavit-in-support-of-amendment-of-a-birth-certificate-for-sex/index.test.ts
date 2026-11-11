import { describe, it, vi } from "vitest";
import type { Data } from "#lib/forms/questions";
import { expectPdfFieldsMatch } from "#lib/pdfs/expectPdfFieldsMatch";
import birthCertificateAmendment from ".";

describe("R-116 - MA - Affidavit to amend birth certificate", () => {
  const testData: Data = {
    oldFirstName: "Oirst",
    oldMiddleName: "Oiddle",
    oldLastName: "Oast",
    oldGender: "Male",
    dateOfBirth: "2010-01-31",
    birthplaceCity: "Port Townsend",
    parent1FirstName: "First",
    parent1LastName: "Parent",
    parent2FirstName: "Second",
    parent2MiddleName: "Middle",
    parent2LastName: "Parent",
    newFirstName: "Nirst",
    newMiddleName: "Niddle",
    newLastName: "Nast",
    newGender: "X",
    mailingStreetAddress: "123 Main St",
    mailingCity: "Austin",
    mailingState: "TX",
    mailingZipCode: "78703",
    phoneNumber: "+12143334444",
    email: "hello@namesake.fyi",
    guardianFirstName: "Guardian",
    guardianLastName: "Last",
  };

  it("maps all fields correctly to the PDF", async () => {
    vi.setSystemTime(new Date(2025, 1, 31)); // The applicant is under 18 and therefore needs a guardian's consent
    await expectPdfFieldsMatch(birthCertificateAmendment, testData);
  });
});
