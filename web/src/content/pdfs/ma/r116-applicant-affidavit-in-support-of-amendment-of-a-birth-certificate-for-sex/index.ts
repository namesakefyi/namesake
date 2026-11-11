import { definePdf } from "#lib/pdfs/definePdf";
import { joinNames } from "#lib/utils/joinNames";
import { joinParts } from "#lib/utils/joinParts";
import pdf from "./applicant-affidavit-in-support-of-amendment-of-a-birth-certificate-for-sex.pdf";
import type { PdfFieldName } from "./schema";

export default definePdf<PdfFieldName>({
  id: "r116-applicant-affidavit-in-support-of-amendment-of-a-birth-certificate-for-sex",
  title:
    "Applicant Affidavit in Support of Amendment of a Birth Certificate for Sex",
  code: "R-116",
  canonicalUrl:
    "https://www.mass.gov/doc/applicant-affidavit-for-amending-sex-on-a-birth-certificate-2/download",
  pdfPath: pdf,
  resolver: (data) => ({
    oldFullName: joinNames(
      data.oldFirstName,
      data.oldMiddleName,
      data.oldLastName,
    ),
    // Sex Listed
    oldGender: data.oldGender,
    // Date of birth
    dateOfBirth: data.dateOfBirth,
    birthplaceCity: data.birthplaceCity,
    // Parent 1 Name
    parent1Name: joinNames(
      data.parent1FirstName,
      data.parent1MiddleName,
      data.parent1LastName,
    ),
    // Parent 2 Name
    parent2Name: joinNames(
      data.parent2FirstName,
      data.parent2MiddleName,
      data.parent2LastName,
    ),
    // Name First Middle Last to appear
    newFullName: joinNames(
      data.newFirstName,
      data.newMiddleName,
      data.newLastName,
    ),
    // Sex to appear
    newGender: data.newGender,
    // Mailing Address
    mailingAddress: joinParts(
      data.mailingStreetAddress,
      data.mailingStreetAddress2,
      data.mailingZipCode,
      data.mailingCity,
      data.mailingState,
    ),
    phoneNumber: data.phoneNumber,
    email: data.email,
    // A court certified copy of a legal name change decree if applicable and
    // We check this box if the applicant is changing their name
    nameChangeDecreeIncluded:
      joinNames(data.oldFirstName, data.oldMiddleName, data.oldLastName) !==
      joinNames(data.newFirstName, data.newMiddleName, data.newLastName),
    // A check or money order payable to the Commonwealth of Massachusetts as follows
    paymentIncluded: !data.shouldWaiveDocumentFees,
    // Name of Parent/Guardian1
    guardianOneFullName: joinNames(
      data.guardianFirstName,
      data.guardianMiddleName,
      data.guardianLastName,
    ),
    // Name of Parent/Guardian2
    guardianTwoFullName: joinNames(
      data.coGuardianFirstName,
      data.coGuardianMiddleName,
      data.coGuardianLastName,
    ),
  }),
});
