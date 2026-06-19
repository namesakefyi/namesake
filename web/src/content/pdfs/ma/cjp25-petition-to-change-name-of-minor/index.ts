import { definePdf } from "#lib/pdfs/definePdf";
import { deriveCurrentAge } from "#lib/utils/deriveCurrentAge";
import { formatDateMMDDYYYY } from "#lib/utils/formatDateMMDDYYYY";
import { formatLanguage } from "#lib/utils/formatLanguage";
import { joinPronouns } from "#lib/utils/joinPronouns";
import pdf from "./cjp25-petition-to-change-name-of-minor.pdf";
import type { PdfFieldName } from "./schema";

export default definePdf<PdfFieldName>({
  id: "cjp25-petition-to-change-name-of-minor",
  title: "Petition to Change Name of Minor",
  code: "CJP-25",
  jurisdiction: "MA",
  canonicalUrl:
    "https://www.mass.gov/doc/petition-to-change-name-of-minor-cjp-25/download",
  pdfPath: pdf,
  resolver: (data) => ({
    // Header
    petitionerFirstName: data.oldFirstName,
    petitionerMiddleName: data.oldMiddleName,
    petitionerLastName: data.oldLastName,
    county: data.residenceCounty,

    // 1. Petitioner (minor)
    oldFirstName: data.oldFirstName,
    oldMiddleName: data.oldMiddleName,
    oldLastName: data.oldLastName,

    // 2. Petition presented by
    isPresentedByLegalParent1: data.isPresentedByLegalMotherParent1,
    isPresentedByLegalParent2: data.isPresentedByLegalFatherParent2,
    isPresentedByLegalParent3: undefined,
    isPresentedByCourtAppointedGuardian:
      data.isPresentedByCourtAppointedGuardian,

    // 3. Minor's info
    dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
    currentAge: deriveCurrentAge(data.dateOfBirth)?.toString(),

    // 4. Minor's address
    mailingStreetAddress: data.residenceStreetAddress,
    mailingStreetAddress2: undefined,
    mailingCity: data.residenceCity,
    mailingState: data.residenceState,
    mailingZipCode: data.residenceZipCode,
    isUnderSupervisionOfMassDeptOfYouthServices:
      data.isUnderSupervisionOfMassDeptOfYouthServices,

    // 5. Has previous name change?
    hasPreviousNameChangeTrue: data.hasPreviousNameChange,
    hasPreviousNameChangeFalse: !data.hasPreviousNameChange,
    previousNameFrom: data.previousNameFrom,
    previousNameTo: data.previousNameTo,
    previousNameReason: data.previousNameReason,

    // Assume return of certified docs
    shouldReturnOriginalDocuments: true,

    // 6. Legal parents
    parent1FirstName: undefined,
    parent1MiddleName: undefined,
    parent1LastName: undefined,
    parent1StreetAddress: data.parent1StreetAddress,
    parent1StreetAddress2: undefined,
    parent1City: data.parent1City,
    parent1State: data.parent1State,
    parent1ZipCode: data.parent1ZipCode,
    parent1Phone: data.parent1Phone,
    parent1Email: data.parent1Email,

    parent2FirstName: undefined,
    parent2MiddleName: undefined,
    parent2LastName: undefined,
    parent2StreetAddress:
      data.parentsHaveDifferentAddresses === true
        ? data.parent2StreetAddress
        : data.parent1StreetAddress,
    parent2StreetAddress2: undefined,
    parent2City:
      data.parentsHaveDifferentAddresses === true
        ? data.parent2City
        : data.parent1City,
    parent2State:
      data.parentsHaveDifferentAddresses === true
        ? data.parent2State
        : data.parent1State,
    parent2ZipCode:
      data.parentsHaveDifferentAddresses === true
        ? data.parent2ZipCode
        : data.parent1ZipCode,
    parent2Phone: data.parent2Phone,
    parent2Email: data.parent2Email,

    parent3FirstName: undefined,
    parent3MiddleName: undefined,
    parent3LastName: undefined,
    parent3StreetAddress: undefined,
    parent3StreetAddress2: undefined,
    parent3City: undefined,
    parent3State: undefined,
    parent3ZipCode: undefined,
    parent3Phone: undefined,
    parent3Email: undefined,

    // Primary contact info
    phoneNumber: undefined,
    email: undefined,

    // Parental info
    isOnlyOneParentListedOnBirthCertificate:
      !data.areBothParentsListedOnBirthCertificate,
    isALegalParentDeceased: data.isALegalParentDeceased,
    hasLegalParentHadParentalRightsTerminated:
      data.hasLegalParentHadParentalRightsTerminated,

    // 7. Court-appointed guardian
    hasCountAppointedGuardianFalse: !data.hasCourtAppointedGuardian,
    hasCourtAppointedGuardianTrue: data.hasCourtAppointedGuardian,

    guardianFirstName: undefined,
    guardianMiddleName: undefined,
    guardianLastName: undefined,
    guardianStreetAddress: data.guardianStreetAddress,
    guardianStreetAddress2: undefined,
    guardianCity: data.guardianCity,
    guardianState: data.guardianState,
    guardianZipCode: data.guardianZipCode,
    guardianPhone: data.guardianPhone,
    guardianEmail: data.guardianEmail,

    coGuardianFirstName: undefined,
    coGuardianMiddleName: undefined,
    coGuardianLastName: undefined,
    coGuardianStreetAddress: data.coGuardianStreetAddress,
    coGuardianStreetAddress2: undefined,
    coGuardianCity: data.coGuardianCity,
    coGuardianState: data.coGuardianState,
    coGuardianZipCode: data.coGuardianZipCode,
    coGuardianPhone: data.coGuardianPhone,
    coGuardianEmail: data.coGuardianEmail,

    // 8. Child under 12?
    isChildUnder12: (deriveCurrentAge(data.dateOfBirth) ?? 0) < 12,

    // 9. Legal parent 1 consents?
    isParent1AssentingTrue: data.isParent1Assenting,
    isParent1AssentingFalse: !data.isParent1Assenting,
    parent1DissentReason: data.parent1DissentReason,

    // 10. Legal parent 2 consents?
    isParent2AssentingTrue: data.isParent2Assenting,
    isParent2AssentingFalse: !data.isParent2Assenting,
    parent2DissentReason: data.parent2DissentReason,

    // 11. Legal parent 3 consents?
    isParent3AssentingTrue: undefined,
    isParent3AssentingFalse: undefined,
    parent3DissentReason: undefined,

    // 12. All court-appointed guardians consent?
    isAllGuardiansAssentingTrue: data.isAllGuardiansAssenting,
    isAllGuardiansAssentingFalse: !data.isAllGuardiansAssenting,
    guardianDissentReason: data.guardianDissentReason,

    // 13. New name
    newFirstName: data.newFirstName,
    newMiddleName: data.newMiddleName,
    newLastName: data.newLastName,

    // 14. Reason for changing name
    reasonForChangingName: data.reasonForChangingName,

    // 15. Text-only

    // 16. Interpreters needed?
    isInterpreterNeededForChild: data.isInterpreterNeededForChild,
    isInterpreterNeededForParent1: data.isInterpreterNeededForParent1,
    isInterpreterNeededForParent2: data.isInterpreterNeededForParent2,
    isInterpreterNeededForParent3: undefined,
    isInterpreterNeededForGuardian: data.isInterpreterNeededForGuardian,
    languages: formatLanguage(data.language),

    // 16. Okay to share pronouns?
    isOkayToSharePronouns: data.isOkayToSharePronouns,
    pronouns: joinPronouns(data.pronouns, data.otherPronouns),
  }),
});
