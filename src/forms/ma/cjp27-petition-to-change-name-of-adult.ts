import { definePdf } from "@/forms/utils";
import { formatDateMMDDYYYY, joinPronouns } from "@/utils/pdf-helpers";
import languageNameMap from "language-name-map/map";
import pdf from "./cjp27-petition-to-change-name-of-adult.pdf";

export default definePdf({
  id: "cjp27-petition-to-change-name-of-adult",
  title: "Petition to Change Name of Adult",
  code: "CJP 27",
  jurisdiction: "MA",
  pdfPath: pdf,
  fields: (data) => ({
    // Petitioner
    petitionerFirstName: data.oldFirstName,
    petitionerMiddleName: data.oldMiddleName,
    petitionerLastName: data.oldLastName,

    // Division (County)
    county: data.residenceCounty,

    // Current legal name
    oldFirstName: data.oldFirstName,
    oldMiddleName: data.oldMiddleName,
    oldLastName: data.oldLastName,

    // I was born in:
    birthplaceCity: data.birthplaceCity,
    birthplaceState: data.birthplaceState,
    dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),

    // I currently reside at:
    residenceStreetAddress: data.residenceStreetAddress,
    residenceCity: data.residenceCity,
    residenceState: data.residenceState,
    residenceZipCode: data.residenceZipCode,

    // Mailing address (if different)
    ...(data.isMailingAddressDifferentFromResidence
      ? {
          mailingStreetAddress: data.mailingStreetAddress,
          mailingCity: data.mailingCity,
          mailingState: data.mailingState,
          mailingZipCode: data.mailingZipCode,
        }
      : {}),

    // Contact
    email: data.email,
    phoneNumber: data.phoneNumber,

    // Previous name change
    hasPreviousNameChangeTrue: data.hasPreviousNameChange,
    hasPreviousNameChangeFalse: !data.hasPreviousNameChange,

    // Previous legal names
    previousNameFrom: data.previousNameFrom,
    previousNameTo: data.previousNameTo,
    previousNameReason: data.previousNameReason,

    // Return certified documents
    shouldReturnOriginalDocuments: data.shouldReturnOriginalDocuments,

    // Other names or aliases
    hasUsedOtherNameOrAliasTrue: data.hasUsedOtherNameOrAlias,
    hasUsedOtherNameOrAliasFalse: !data.hasUsedOtherNameOrAlias,
    otherNamesOrAliases: data.otherNamesOrAliases,

    // New legal name
    newFirstName: data.newFirstName,
    newMiddleName: data.newMiddleName,
    newLastName: data.newLastName,

    // Reason for changing name
    reasonForChangingName: data.reasonForChangingName,

    // Interpreter
    ...(data.isInterpreterNeeded
      ? {
          isInterpreterNeeded: data.isInterpreterNeeded,
          language: data.language ? languageNameMap[data.language].name : "",
        }
      : {}),

    // Okay to share pronouns
    ...(data.isOkayToSharePronouns
      ? {
          isOkayToSharePronouns: data.isOkayToSharePronouns,
          pronouns: joinPronouns(data.pronouns, data.otherPronouns),
        }
      : {}),
  }),
});
