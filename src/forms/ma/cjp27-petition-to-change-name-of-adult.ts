import { definePdf } from "@/utils/pdf";
import { joinPronouns } from "@/utils/pdf-helpers";
import pdf from "./cjp27-petition-to-change-name-of-adult.pdf";

export default definePdf({
  title: "Petition to Change Name of Adult",
  code: "CJP 27",
  pdfPath: pdf,
  jurisdiction: "MA",
  fields: (data: {
    newFirstName?: string;
    newMiddleName?: string;
    newLastName?: string;
    oldFirstName?: string;
    oldMiddleName?: string;
    oldLastName?: string;
    birthplaceCity?: string;
    birthplaceState?: string;
    residenceStreetAddress?: string;
    residenceCity?: string;
    residenceState?: string;
    residenceZipCode?: string;
    email?: string;
    phoneNumber?: string;
    isMailingAddressDifferentFromResidence?: boolean;
    mailingStreetAddress?: string;
    mailingCity?: string;
    mailingState?: string;
    mailingZipCode?: string;
    dateOfBirth?: string;
    hasPreviousNameChange?: boolean;
    previousNameFrom?: string;
    previousNameTo?: string;
    previousNameReason?: string;
    shouldReturnOriginalDocuments?: boolean;
    hasUsedOtherNameOrAlias?: boolean;
    otherNamesOrAliases?: string;
    reasonForChangingName?: string;
    isInterpreterNeeded?: boolean;
    language?: string;
    isOkayToSharePronouns?: boolean;
    pronouns?: string;
    otherPronouns?: string;
  }) => ({
    // Petitioner
    petitionerFirstName: data.oldFirstName,
    petitionerMiddleName: data.oldMiddleName,
    petitionerLastName: data.oldLastName,

    // Division (County)
    county: "Suffolk", // TODO: https://github.com/namesakefyi/namesake/issues/453

    // Current legal name
    oldFirstName: data.oldFirstName,
    oldMiddleName: data.oldMiddleName,
    oldLastName: data.oldLastName,

    // I was born in:
    birthplaceCity: data.birthplaceCity,
    birthplaceState: data.birthplaceState,
    dateOfBirth: data.dateOfBirth,

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
          language: data.language,
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
