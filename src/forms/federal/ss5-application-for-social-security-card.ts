import { definePdf } from "@/forms/utils";
import {
  formatBirthplaceStateOrCountry,
  formatDateMMDDYYYY,
} from "@/utils/pdf-helpers";
import pdf from "./ss5-application-for-social-security-card.pdf";

export default definePdf({
  id: "ss5-application-for-social-security-card",
  title: "Application for Social Security Card",
  code: "SS-5",
  pdfPath: pdf,
  fields: (data) => ({
    // Field 1: Name
    newFirstName: data.newFirstName,
    newMiddleName: data.newMiddleName,
    newLastName: data.newLastName,
    oldFirstName: data.oldFirstName,
    oldMiddleName: data.oldMiddleName,
    oldLastName: data.oldLastName,
    otherNames: data.previousLegalNames,

    // Field 2: Social Security (Not asked)

    // Field 3: Birthplace
    birthplaceCity: data.birthplaceCity,
    birthplaceState: formatBirthplaceStateOrCountry(
      data.birthplaceState,
      data.birthplaceCountry,
    ),

    // Field 4: Date of Birth
    dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),

    // Field 5: Citizenship
    usCitizen: data.citizenshipStatus === "usCitizen",
    legalAlienAllowedToWork:
      data.citizenshipStatus === "legalAlienAllowedToWork",
    legalAlienNotAllowedToWork:
      data.citizenshipStatus === "legalAlienNotAllowedToWork",
    citizenshipOther: data.citizenshipStatus === "other",

    // Field 6: Ethnicity
    isHispanicOrLatino: data.isHispanicOrLatino === true,
    isNotHispanicOrLatino: data.isHispanicOrLatino === false,

    // Field 7: Race
    isNativeHawaiian: data.race?.includes("nativeHawaiian"),
    isAlaskaNative: data.race?.includes("alaskaNative"),
    isAsian: data.race?.includes("asian"),
    isAmericanIndian: data.race?.includes("americanIndian"),
    isBlack: data.race?.includes("black"),
    isOtherPacificIslander: data.race?.includes("otherPacificIslander"),
    isWhite: data.race?.includes("white"),

    // Field 8: Sex
    isMale: data.sexAssignedAtBirth === "male",
    isFemale: data.sexAssignedAtBirth === "female",

    // Field 9: Mother's name
    mothersFirstName: data.mothersFirstName,
    mothersMiddleName: data.mothersMiddleName,
    mothersLastName: data.mothersLastName,

    // Field 10: Father's name
    fathersFirstName: data.fathersFirstName,
    fathersMiddleName: data.fathersMiddleName,
    fathersLastName: data.fathersLastName,

    // Field 11: Previous Social Security Card
    hasPreviousSocialSecurityCard: data.hasPreviousSocialSecurityCard === true,
    hasNoPreviousSocialSecurityCard:
      data.hasPreviousSocialSecurityCard === false,

    // Field 12: Previous Social Security Card name
    previousSocialSecurityCardFirstName:
      data.previousSocialSecurityCardFirstName,
    previousSocialSecurityCardMiddleName:
      data.previousSocialSecurityCardMiddleName,
    previousSocialSecurityCardLastName: data.previousSocialSecurityCardLastName,

    // Field 13: Different date of birth (not asked)

    // Field 14: Today's date
    todaysDate: new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }),

    // Field 15: Phone number
    phoneNumber: data.phoneNumber,

    // Field 16: Address
    mailingStreetAddress: data.mailingStreetAddress,
    mailingCity: data.mailingCity,
    mailingState: data.mailingState,
    mailingZipCode: data.mailingZipCode,

    // Field 17: Signature (not asked)

    // Field 18: Relationship to the person you are filing for
    isSelf: data.isFilingForSomeoneElse === false,
    isParent: data.relationshipToFilingFor === "parent",
    isGuardian: data.relationshipToFilingFor === "legalGuardian",
    isFilingOther: data.relationshipToFilingFor === "other",
    otherSpecify: data.relationshipToFilingForOther,
  }),
});
