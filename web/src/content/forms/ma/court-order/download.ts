import cjp27 from "#content/pdfs/ma/cjp27-petition-to-change-name-of-adult";
import cjp34, {
  fillCjp34,
} from "#content/pdfs/ma/cjp34-cori-and-wms-release-request";
import { defineDownload } from "#lib/forms/defineForm";
import { formatDateMMDDYYYY } from "#lib/utils/formatDateMMDDYYYY";
import { formatLanguage } from "#lib/utils/formatLanguage";
import { joinPronouns } from "#lib/utils/joinPronouns";

export default defineDownload({
  title: "Massachusetts Court Order",
  instructions: [
    "Do not sign the Petition to Change Name (CJP 27) until in the presence of a notary.",
    "Review all documents carefully.",
    "File with the Probate and Family Court in your county.",
    "Remember to bring a certified copy of your birth certificate and certified copies of any previous name changes.",
  ],
  pdfs: [
    {
      pdf: cjp27,
      fill: (data) => ({
        petitionerFirstName: data.oldFirstName,
        petitionerMiddleName: data.oldMiddleName,
        petitionerLastName: data.oldLastName,
        county: data.residenceCounty,
        oldFirstName: data.oldFirstName,
        oldMiddleName: data.oldMiddleName,
        oldLastName: data.oldLastName,
        birthplaceCity: data.birthplaceCity,
        birthplaceState: data.birthplaceState,
        dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
        residenceStreetAddress: data.residenceStreetAddress,
        residenceSteetAddress2: data.residenceStreetAddress2,
        residenceCity: data.residenceCity,
        residenceState: data.residenceState,
        residenceZipCode: data.residenceZipCode,
        mailingStreetAddress: data.mailingStreetAddress,
        mailingStreetAddress2: data.mailingStreetAddress2,
        mailingCity: data.mailingCity,
        mailingState: data.mailingState,
        mailingZipCode: data.mailingZipCode,
        email: data.email,
        phoneNumber: data.phoneNumber,
        hasPreviousNameChangeTrue: data.hasPreviousNameChange,
        hasPreviousNameChangeFalse: data.hasPreviousNameChange === false,
        previousNameFrom: data.previousNameFrom,
        previousNameTo: data.previousNameTo,
        previousNameReason: data.previousNameReason,
        shouldReturnOriginalDocuments: true,
        hasUsedOtherNameOrAliasTrue: data.hasUsedOtherNameOrAlias,
        hasUsedOtherNameOrAliasFalse: data.hasUsedOtherNameOrAlias === false,
        otherNamesOrAliases: data.otherNamesOrAliases,
        newFirstName: data.newFirstName,
        newMiddleName: data.newMiddleName,
        newLastName: data.newLastName,
        reasonForChangingName: data.reasonForChangingName,
        hasNoRecordOfOtherStateConvictionsProbationParole:
          data.hasNoRecordOfOtherStateConvictionsProbationParole,
        isInterpreterNeeded: data.isInterpreterNeeded,
        language: formatLanguage(data.language),
        isOkayToSharePronouns: data.isOkayToSharePronouns,
        pronouns: joinPronouns(data.pronouns, data.otherPronouns),
      }),
    },
    { pdf: cjp34, fill: fillCjp34 },
  ],
});
