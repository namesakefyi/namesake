import { describe, it } from "vitest";
import type { FormData } from "#constants/fields";
import { expectPdfFieldsMatch } from "#lib/pdfs/expectPdfFieldsMatch";
import applicantAffidavitInSupportOfAmendmentOfABirthCertificateForSex from ".";

describe("Applicant Affidavit in Support of Amendment of a Birth Certificate for Sex", () => {
  const testData: Partial<FormData> = {
    // TODO: map PDF fields to form data: Name First Middle Last, Sex Listed, Date of Birth, CityTown of Birth, Parent 1 Name, Parent 2 Name, Name First Middle Last to appear, Sex to appear, Mailing Address, Applicants contact information, Telephone optional, Email, A courtcertified copy of a legal name change decree if applicable and, A check or money order payable to the Commonwealth of Massachusetts as follows, Name of Parent/Guardian1, Name of Parent/Guardian2, Signature of ParentGuardian 1 X, ParentGuardian1 SignatureDate, ParentGuardian2 SignatureX, ParentGuardian2 SignatureDate, Signature of Subject, SubjectSignatureDate
  };

  it("maps all fields correctly to the PDF", async () => {
    await expectPdfFieldsMatch(
      applicantAffidavitInSupportOfAmendmentOfABirthCertificateForSex,
      testData,
    );
  });

  // Test any derived fields below
});
