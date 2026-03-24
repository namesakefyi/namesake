import { definePdf } from "@/pdfs/utils/definePdf";
import { deriveCurrentAge } from "@/utils/deriveCurrentAge";
import { formatDateMMDDYYYY } from "@/utils/formatDateMMDDYYYY";
import { formatLanguage } from "@/utils/formatLanguage";
import { joinPronouns } from "@/utils/joinPronouns";
import pdf from "./cjp25-petition-to-change-name-of-minor.pdf";
import type { PdfFieldName } from "./schema";

export default definePdf<PdfFieldName>({
  id: "cjp25-petition-to-change-name-of-minor",
  title: "Petition to Change Name of Minor",
  code: "CJP-25",
  jurisdiction: "MA",
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
    isPresentedByLegalMotherParent1: data.isPresentedByLegalMotherParent1,
    isPresentedByLegalFatherParent2: data.isPresentedByLegalFatherParent2,
    isPresentedByCourtAppointedGuardian:
      data.isPresentedByCourtAppointedGuardian,

    // 3. Minor's info
    birthplaceCity: data.birthplaceCity,
    birthplaceState: data.birthplaceState,
    dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
    currentAge: deriveCurrentAge(data.dateOfBirth)?.toString(),

    // 4. Minor's address
    mailingStreetAddress: data.residenceStreetAddress,
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

    shouldReturnOriginalDocuments: data.shouldReturnOriginalDocuments,

    // 6. Legal parents
    parent1FullName: data.parent1FullName,
    parent1StreetAddress: data.parent1StreetAddress,
    parent1City: data.parent1City,
    parent1State: data.parent1State,
    parent1ZipCode: data.parent1ZipCode,
    parent1Phone: data.parent1Phone,
    parent1Email: data.parent1Email,

    parent2FullName: data.parent2FullName,
    parent2StreetAddress:
      data.parentsHaveDifferentAddresses === true
        ? data.parent2StreetAddress
        : data.parent1StreetAddress,
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

    // Parental info
    isOnlyOneParentListedOnBirthCertificate:
      !data.areBothParentsListedOnBirthCertificate,
    isALegalParentDeceased: data.isALegalParentDeceased,
    hasLegalParentHadParentalRightsTerminated:
      data.hasLegalParentHadParentalRightsTerminated,

    // 7. Court-appointed guardian
    hasCountAppointedGuardianFalse: !data.hasCourtAppointedGuardian,
    hasCourtAppointedGuardianTrue: data.hasCourtAppointedGuardian,

    guardianFullName: data.guardianFullName,
    guardianStreetAddress: data.guardianStreetAddress,
    guardianCity: data.guardianCity,
    guardianState: data.guardianState,
    guardianZipCode: data.guardianZipCode,
    guardianPhone: data.guardianPhone,
    guardianEmail: data.guardianEmail,

    coGuardianFullName: data.coGuardianFullName,
    coGuardianStreetAddress: data.coGuardianStreetAddress,
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

    // 11. All court-appointed guardians consent?
    isAllGuardiansAssentingTrue: data.isAllGuardiansAssenting,
    isAllGuardiansAssentingFalse: !data.isAllGuardiansAssenting,
    hasNoCountAppointedGuardian: !data.hasCourtAppointedGuardian,
    guardianDissentReason: data.guardianDissentReason,

    // 12. New name
    newFirstName: data.newFirstName,
    newMiddleName: data.newMiddleName,
    newLastName: data.newLastName,

    // 13. Reason for changing name
    reasonForChangingName: data.reasonForChangingName,

    // 14. Text-only

    // 15. Interpreters needed?
    isInterpreterNeededForChild: data.isInterpreterNeededForChild,
    isInterpreterNeededForParent1: data.isInterpreterNeededForParent1,
    isInterpreterNeededForParent2: data.isInterpreterNeededForParent2,
    isInterpreterNeededForGuardian: data.isInterpreterNeededForGuardian,
    languages: formatLanguage(data.language),

    // 16. Okay to share pronouns?
    isOkayToSharePronouns: data.isOkayToSharePronouns,
    pronouns: joinPronouns(data.pronouns, data.otherPronouns),
  }),
});
