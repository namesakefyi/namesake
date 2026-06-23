import { describe, it, vi } from "vitest";
import type { FormData } from "#constants/fields";
import { expectPdfFieldsMatch } from "#lib/pdfs/expectPdfFieldsMatch";
import birthCertificateAmendment from ".";

describe("R-116 - MA - Affidavit to amend birth certificate", () => {
  const testData: Partial<FormData> = {
    oldFirstName: "Oirst",
    oldMiddleName: "Oiddle",
    oldLastName: "Oast",
    oldGender: "Male",
    dateOfBirth: "2010-01-31",
    birthplaceCity: "Port Townsend",
    parent1FullName: "First parent full name",
    parent2FullName: "Second parent full name",
    newFirstName: "Nirst",
    newMiddleName: "Niddle",
    newLastName: "Nast",
    newGender: "x",
    mailingStreetAddress: "123 Main St",
    mailingCity: "Austin",
    mailingState: "TX",
    mailingZipCode: "78703",
    phoneNumber: "+12143334444",
    email: "hello@namesake.fyi",
    nameChangeDecreeIncluded: true,
    paymentIncluded: false,
    guardianOneFullName: "Guardian first and last",
    guardianTwoFullName: "", // Optional
  };

  it("maps all fields correctly to the PDF", async () => {
    vi.setSystemTime(new Date(2025, 5, 15)); // Jun 15, 2020 - the application is 15 and thus needs a guardian's consent
    await expectPdfFieldsMatch(birthCertificateAmendment, testData);
  });
});
