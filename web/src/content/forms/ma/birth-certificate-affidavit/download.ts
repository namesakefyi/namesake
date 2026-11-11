import r116 from "#content/pdfs/ma/r116-applicant-affidavit-in-support-of-amendment-of-a-birth-certificate-for-sex";
import { defineDownload } from "#lib/forms/defineForm";
import { fullName } from "#lib/utils/fullName";
import { joinParts } from "#lib/utils/joinParts";

export default defineDownload({
  title: "Massachusetts Birth Certificate Affidavit",
  instructions: [
    "Review all documents carefully.",
    "For a name change, you must first update your name with the Social Security Administration, then you must submit a legal name change order with the application.",
    {
      text: "Provide a court-certified copy of your legal name change decree",
      when: (data) => fullName(data, "oldName") !== fullName(data, "newName"),
    },
    "Sign and date the required fields.",
  ],
  pdfs: [
    {
      pdf: r116,
      fill: (data) => ({
        oldFullName: fullName(data, "oldName"),
        // Sex Listed
        oldGender: data.oldGender,
        // Date of birth
        dateOfBirth: data.dateOfBirth,
        birthplaceCity: data.birthplaceCity,
        // Parent 1 Name
        parent1Name: fullName(data, "parent1Name"),
        // Parent 2 Name
        parent2Name: fullName(data, "parent2Name"),
        // Name First Middle Last to appear
        newFullName: fullName(data, "newName"),
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
          fullName(data, "oldName") !== fullName(data, "newName"),
        // A check or money order payable to the Commonwealth of Massachusetts as follows
        paymentIncluded: !data.shouldWaiveDocumentFees,
        // Name of Parent/Guardian1
        guardianOneFullName: fullName(data, "guardianName"),
        // Name of Parent/Guardian2
        guardianTwoFullName: fullName(data, "coGuardianName"),
      }),
    },
  ],
});
