import cjp25 from "#content/pdfs/ma/cjp25-petition-to-change-name-of-minor";
import cjp34, {
  fillCjp34,
} from "#content/pdfs/ma/cjp34-cori-and-wms-release-request";
import { defineDownload } from "#lib/forms/defineForm";
import { deriveCurrentAge } from "#lib/utils/deriveCurrentAge";
import { formatDateMMDDYYYY } from "#lib/utils/formatDateMMDDYYYY";
import { formatLanguage } from "#lib/utils/formatLanguage";
import { joinPronouns } from "#lib/utils/joinPronouns";
import { needsRecordRequest } from "./steps";

export default defineDownload({
  title: "Massachusetts Court Order (Minor)",
  instructions: [
    "Review all documents carefully.",
    "Do not sign the Petition to Change Name of Minor (CJP 25) until in the presence of a notary.",
    "File with the Probate and Family Court in your county.",
    {
      text: "Since the address or whereabouts of legal parent(s) is unknown, you must file a Motion for Service by Alternate Means and Affidavit of Diligent Search (CJP 31) with a Military Affidavit (TC0002).",
      when: (data) => data.areParentAddressesUnknown === true,
    },
    {
      text: "Attach a copy of the parental death certificate.",
      when: (data) => data.isALegalParentDeceased === true,
    },
    {
      text: "Attach court proof of parental termination of rights.",
      when: (data) => data.hasLegalParentHadParentalRightsTerminated === true,
    },
    "Remember to bring all supporting documents to the court.",
  ],
  pdfs: [
    {
      pdf: cjp25,
      fill: (data) => ({
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
        hasPreviousNameChangeFalse: data.hasPreviousNameChange === false,
        previousNameFrom: data.previousNameFrom,
        previousNameTo: data.previousNameTo,
        previousNameReason: data.previousNameReason,

        // Assume return of certified docs
        shouldReturnOriginalDocuments: true,

        // 6. Legal parents
        parent1FirstName: data.parent1FirstName,
        parent1MiddleName: data.parent1MiddleName,
        parent1LastName: data.parent1LastName,
        parent1StreetAddress: data.parent1StreetAddress,
        parent1StreetAddress2: undefined,
        parent1City: data.parent1City,
        parent1State: data.parent1State,
        parent1ZipCode: data.parent1ZipCode,
        parent1Phone: data.parent1Phone,
        parent1Email: data.parent1Email,

        parent2FirstName: data.parent2FirstName,
        parent2MiddleName: data.parent2MiddleName,
        parent2LastName: data.parent2LastName,
        parent2StreetAddress:
          data.areParentAddressesDifferent === true
            ? data.parent2StreetAddress
            : data.parent1StreetAddress,
        parent2StreetAddress2: undefined,
        parent2City:
          data.areParentAddressesDifferent === true
            ? data.parent2City
            : data.parent1City,
        parent2State:
          data.areParentAddressesDifferent === true
            ? data.parent2State
            : data.parent1State,
        parent2ZipCode:
          data.areParentAddressesDifferent === true
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

        // Primary contact info
        phoneNumber: undefined,
        email: undefined,

        // Parental info
        isOnlyOneParentListedOnBirthCertificate:
          data.areBothParentsListedOnBirthCertificate === false,
        isALegalParentDeceased: data.isALegalParentDeceased,
        hasLegalParentHadParentalRightsTerminated:
          data.hasLegalParentHadParentalRightsTerminated,

        // 7. Court-appointed guardian
        hasCountAppointedGuardianFalse:
          data.hasCourtAppointedGuardian === false,
        hasCourtAppointedGuardianTrue: data.hasCourtAppointedGuardian,

        guardianFirstName: data.guardianFirstName,
        guardianMiddleName: data.guardianMiddleName,
        guardianLastName: data.guardianLastName,
        guardianStreetAddress: data.guardianStreetAddress,
        guardianStreetAddress2: undefined,
        guardianCity: data.guardianCity,
        guardianState: data.guardianState,
        guardianZipCode: data.guardianZipCode,
        guardianPhone: data.guardianPhone,
        guardianEmail: data.guardianEmail,

        coGuardianFirstName: data.coGuardianFirstName,
        coGuardianMiddleName: data.coGuardianMiddleName,
        coGuardianLastName: data.coGuardianLastName,
        coGuardianStreetAddress: data.coGuardianStreetAddress,
        coGuardianStreetAddress2: undefined,
        coGuardianCity: data.coGuardianCity,
        coGuardianState: data.coGuardianState,
        coGuardianZipCode: data.coGuardianZipCode,
        coGuardianPhone: data.coGuardianPhone,
        coGuardianEmail: data.coGuardianEmail,

        // 8. Child under 12?
        isChildUnder12: !needsRecordRequest(data),

        // 9. Legal parent 1 consents?
        isParent1AssentingTrue: data.isParent1Assenting,
        isParent1AssentingFalse: data.isParent1Assenting === false,
        parent1DissentReason: data.parent1DissentReason,

        // 10. Legal parent 2 consents?
        isParent2AssentingTrue: data.isParent2Assenting,
        isParent2AssentingFalse: data.isParent2Assenting === false,
        parent2DissentReason: data.parent2DissentReason,

        // 11. Legal parent 3 consents?
        isParent3AssentingTrue: undefined,
        isParent3AssentingFalse: undefined,
        parent3DissentReason: undefined,

        // 12. All court-appointed guardians consent?
        isAllGuardiansAssentingTrue: data.isAllGuardiansAssenting,
        isAllGuardiansAssentingFalse: data.isAllGuardiansAssenting === false,
        guardianDissentReason: data.guardianDissentReason,

        // 13. New name
        newFirstName: data.newFirstName,
        newMiddleName: data.newMiddleName,
        newLastName: data.newLastName,

        // 14. Reason for name change
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
    },
    { pdf: cjp34, when: needsRecordRequest, fill: fillCjp34 },
  ],
});
