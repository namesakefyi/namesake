import { definePdf } from "~/pdfs/definePdf";
import { formatDateMMDDYYYY } from "~/utils/formatDateMMDDYYYY";
import { formatLanguage } from "~/utils/formatLanguage";
import { joinPronouns } from "~/utils/joinPronouns";
import pdf from "./cjp27-petition-to-change-name-of-adult.pdf";
import type { PdfFieldName } from "./schema";

export default definePdf<PdfFieldName>({
  id: "cjp27-petition-to-change-name-of-adult",
  title: "Petition to Change Name of Adult",
  code: "CJP-27",
  jurisdiction: "MA",
  canonicalUrl:
    "https://www.mass.gov/doc/petition-to-change-name-of-adult-cjp-27/download",
  pdfPath: pdf,
  resolver: (data) => ({
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
    hasPreviousNameChangeFalse: !data.hasPreviousNameChange,
    previousNameFrom: data.previousNameFrom,
    previousNameTo: data.previousNameTo,
    previousNameReason: data.previousNameReason,
    shouldReturnOriginalDocuments: true,
    hasUsedOtherNameOrAliasTrue: data.hasUsedOtherNameOrAlias,
    hasUsedOtherNameOrAliasFalse: !data.hasUsedOtherNameOrAlias,
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
});
