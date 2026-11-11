import { DONT_KNOW } from "#constants/fields";
import ss5 from "#content/pdfs/ss5-application-for-social-security-card";
import { defineDownload } from "#lib/forms/defineForm";
import { asList } from "#lib/utils/fieldValue";
import { formatBirthplaceCountryOrState } from "#lib/utils/formatBirthplaceCountryOrState";
import { formatDateMMDDYYYY } from "#lib/utils/formatDateMMDDYYYY";
import { splitPhoneNumber } from "#lib/utils/splitPhoneNumber";
import { GOVERNMENT_DOCUMENT, needsGovernmentDocument } from "./conditions";

export default defineDownload({
  title: "Social Security Card",
  instructions: [
    "Please review all documents carefully.",
    "Fill in your social security number—for security, Namesake never asks for this.",
    "Make an Appointment with a Social Security Administration Office.",
    "Remember to bring certified copies of your completed court order, along with other required supporting documents.",
    { text: GOVERNMENT_DOCUMENT, when: needsGovernmentDocument },
  ],
  pdfs: [
    {
      pdf: ss5,
      fill: (data) => {
        const race = asList(data.race);
        return {
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
          isNativeHawaiian: race?.includes("nativeHawaiian"),
          isAlaskaNative: race?.includes("alaskaNative"),
          isAsian: race?.includes("asian"),
          isAmericanIndian: race?.includes("americanIndian"),
          isBlack: race?.includes("black"),
          isOtherPacificIslander: race?.includes("otherPacificIslander"),
          isWhite: race?.includes("white"),
          isMale: data.sexAssignedAtBirth === "male",
          isFemale: data.sexAssignedAtBirth === "female",
          mothersFirstName: data.mothersFirstName,
          mothersMiddleName: data.mothersMiddleName,
          mothersLastName: data.mothersLastName,
          fathersFirstName: data.fathersFirstName,
          fathersMiddleName: data.fathersMiddleName,
          fathersLastName: data.fathersLastName,
          hasPreviousSocialSecurityCard:
            data.hasPreviousSocialSecurityCard === true,
          hasNoPreviousSocialSecurityCard:
            data.hasPreviousSocialSecurityCard === false,
          previousSocialSecurityCardUnknown:
            data.hasPreviousSocialSecurityCard === DONT_KNOW,
          previousSocialSecurityCardFirstName:
            data.previousSocialSecurityCardFirstName,
          previousSocialSecurityCardMiddleName:
            data.previousSocialSecurityCardMiddleName,
          previousSocialSecurityCardLastName:
            data.previousSocialSecurityCardLastName,
          todaysDate: new Date().toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          }),
          areaCode: splitPhoneNumber(data.phoneNumber).areaCode,
          phoneNumber: splitPhoneNumber(data.phoneNumber).localNumber,
          mailingStreetAddress: data.mailingStreetAddress,
          mailingCity: data.mailingCity,
          mailingState: data.mailingState,
          mailingZipCode: data.mailingZipCode,
          isSelf: data.isFilingForSomeoneElse === false,
          isParent: data.relationshipToFilingFor === "parent",
          isGuardian: data.relationshipToFilingFor === "legalGuardian",
          isFilingOther: data.relationshipToFilingFor === "other",
          otherSpecify: data.relationshipToFilingForOther,
          motherSSN1: undefined,
          motherSSN2: undefined,
          motherSSN3: undefined,
          isMotherSSNUnknown: undefined,
          fatherSSN1: undefined,
          fatherSSN2: undefined,
          fatherSSN3: undefined,
          isFatherSSNUnknown: undefined,
          differentDateOfBirthOnPreviousApplication: undefined,
          previousSSN1: undefined,
          previousSSN2: undefined,
          previousSSN3: undefined,
        };
      },
    },
  ],
});
