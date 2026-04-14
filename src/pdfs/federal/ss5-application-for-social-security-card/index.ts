import { formatBirthplaceCountryOrState } from "../../../utils/formatBirthplaceCountryOrState";
import { formatDateMMDDYYYY } from "../../../utils/formatDateMMDDYYYY";
import { definePdf } from "../../utils/definePdf";
import type { PdfFieldName } from "./schema";
import pdf from "./ss5-application-for-social-security-card.pdf";

export default definePdf<PdfFieldName>({
  id: "ss5-application-for-social-security-card",
  title: "Application for Social Security Card",
  code: "SS-5",
  pdfPath: pdf,
  resolver: (data) => ({
    newFirstName: data.newFirstName,
    newMiddleName: data.newMiddleName,
    newLastName: data.newLastName,
    oldFirstName: data.oldFirstName,
    oldMiddleName: data.oldMiddleName,
    oldLastName: data.oldLastName,
    otherNames: data.previousLegalNames,
    birthplaceCity: data.birthplaceCity,
    birthplaceState: formatBirthplaceCountryOrState(
      data.birthplaceCountry,
      data.birthplaceState,
    ),
    dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
    usCitizen: data.citizenshipStatus === "usCitizen",
    legalAlienAllowedToWork:
      data.citizenshipStatus === "legalAlienAllowedToWork",
    legalAlienNotAllowedToWork:
      data.citizenshipStatus === "legalAlienNotAllowedToWork",
    citizenshipOther: data.citizenshipStatus === "other",
    isHispanicOrLatino: data.isHispanicOrLatino === true,
    isNotHispanicOrLatino: data.isHispanicOrLatino === false,
    isNativeHawaiian: data.race?.includes("nativeHawaiian"),
    isAlaskaNative: data.race?.includes("alaskaNative"),
    isAsian: data.race?.includes("asian"),
    isAmericanIndian: data.race?.includes("americanIndian"),
    isBlack: data.race?.includes("black"),
    isOtherPacificIslander: data.race?.includes("otherPacificIslander"),
    isWhite: data.race?.includes("white"),
    isMale: data.sexAssignedAtBirth === "male",
    isFemale: data.sexAssignedAtBirth === "female",
    mothersFirstName: data.mothersFirstName,
    mothersMiddleName: data.mothersMiddleName,
    mothersLastName: data.mothersLastName,
    fathersFirstName: data.fathersFirstName,
    fathersMiddleName: data.fathersMiddleName,
    fathersLastName: data.fathersLastName,
    hasPreviousSocialSecurityCard: data.hasPreviousSocialSecurityCard === true,
    hasNoPreviousSocialSecurityCard:
      data.hasPreviousSocialSecurityCard === false,
    previousSocialSecurityCardFirstName:
      data.previousSocialSecurityCardFirstName,
    previousSocialSecurityCardMiddleName:
      data.previousSocialSecurityCardMiddleName,
    previousSocialSecurityCardLastName: data.previousSocialSecurityCardLastName,
    todaysDate: new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }),
    phoneNumber: data.phoneNumber,
    mailingStreetAddress: data.mailingStreetAddress,
    mailingCity: data.mailingCity,
    mailingState: data.mailingState,
    mailingZipCode: data.mailingZipCode,
    isSelf: data.isFilingForSomeoneElse === false,
    isParent: data.relationshipToFilingFor === "parent",
    isGuardian: data.relationshipToFilingFor === "legalGuardian",
    isFilingOther: data.relationshipToFilingFor === "other",
    otherSpecify: data.relationshipToFilingForOther,
  }),
});
