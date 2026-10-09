import { COUNTRIES } from "#constants/countries";
import type { FormData } from "#constants/fields";
import {
  requestsNameChange,
  requestsSexDesignationChange,
} from "#content/forms/court-order-ny/conditions";
import { definePdf } from "#lib/pdfs/definePdf";
import { deriveCurrentAge } from "#lib/utils/deriveCurrentAge";
import { formatAddress } from "#lib/utils/formatAddress";
import { formatDateMMDDYYYY } from "#lib/utils/formatDateMMDDYYYY";
import { joinNames } from "#lib/utils/joinNames";
import type { PdfFieldName } from "./schema";
import pdf from "./ucsnc1-name-change-and-or-sex-designation-change-petition-for-individual-adult.pdf";

// An unanswered question must not become a "No" answer.
const yesNo = (answer?: FormData["shouldSealCourtRecord"]) =>
  answer === true ? "Yes" : answer === false ? "No" : undefined;

export default definePdf<PdfFieldName>({
  id: "ucsnc1-name-change-and-or-sex-designation-change-petition-for-individual-adult",
  title:
    "Name Change and/or Sex Designation Change Petition for Individual Adult",
  code: "UCS-NC1",
  jurisdiction: "ny",
  canonicalUrl: "https://www.nycourts.gov/media/32631",
  pdfPath: pdf,
  resolver: (data) => {
    const nameChange = requestsNameChange(data);
    const sexChange = requestsSexDesignationChange(data);
    const childSupport = nameChange && data.paysChildSupport === true;
    const spousalSupport = nameChange && data.paysSpousalSupport === true;
    const age = deriveCurrentAge(data.dateOfBirth);
    const residence = formatAddress({
      street: [data.residenceStreetAddress, data.residenceStreetAddress2]
        .filter(Boolean)
        .join(", "),
      city: data.residenceCity,
      state: data.residenceState?.toUpperCase(),
      zip: data.residenceZipCode,
    });

    return {
      courtType: data.courtType,
      county: data.courtCounty,
      currentLegalName: joinNames(
        data.oldFirstName,
        data.oldMiddleName,
        data.oldLastName,
      ),
      isRequestingNameChange: nameChange,
      isRequestingSexDesignationChange: sexChange,

      // Section A applies only when requesting a name change.
      newFullName: nameChange
        ? joinNames(data.newFirstName, data.newMiddleName, data.newLastName)
        : undefined,
      placeOfBirth: nameChange
        ? [
            data.birthplaceStreetAddress,
            data.birthplaceCity,
            data.birthplaceCountry === "US"
              ? data.birthplaceState?.toUpperCase()
              : data.birthplaceCountry
                ? data.birthplaceRegion
                : undefined,
            data.birthplaceZipCode,
            data.birthplaceCountry
              ? COUNTRIES[data.birthplaceCountry]
              : undefined,
          ]
            .filter(Boolean)
            .join(", ")
        : undefined,
      hasBeenConvictedOfCrime: nameChange
        ? yesNo(data.hasBeenConvictedOfCrime)
        : undefined,
      courtOfConviction:
        nameChange && data.hasBeenConvictedOfCrime === true
          ? data.courtOfConviction
          : undefined,
      crime:
        nameChange && data.hasBeenConvictedOfCrime === true
          ? data.crime
          : undefined,
      hasFiledForBankruptcy: nameChange
        ? yesNo(data.hasFiledForBankruptcy)
        : undefined,
      hasJudgmentsOrLiens: nameChange
        ? yesNo(data.hasJudgmentsOrLiens)
        : undefined,
      isPartyToLawsuitOrCourtCase: nameChange
        ? yesNo(data.isPartyToLawsuitOrCourtCase)
        : undefined,
      bankruptcyJudgmentsLiensDetails:
        nameChange &&
        (data.hasFiledForBankruptcy === true ||
          data.hasJudgmentsOrLiens === true ||
          data.isPartyToLawsuitOrCourtCase === true)
          ? data.bankruptcyJudgmentsLiensDetails
          : undefined,
      isCurrentlyMarried: nameChange
        ? yesNo(data.isCurrentlyMarried)
        : undefined,
      wasPreviouslyMarried: nameChange
        ? yesNo(data.wasPreviouslyMarried)
        : undefined,
      hasChildrenUnder21: nameChange
        ? yesNo(data.hasChildrenUnder21)
        : undefined,
      paysChildSupport: nameChange ? yesNo(data.paysChildSupport) : undefined,
      areChildSupportPaymentsUpToDate: childSupport
        ? yesNo(data.areChildSupportPaymentsUpToDate)
        : undefined,
      childSupportArrearsAmount:
        childSupport && data.areChildSupportPaymentsUpToDate === false
          ? data.childSupportArrearsAmount
          : undefined,
      courtIssuingChildSupportOrder: childSupport
        ? data.courtIssuingChildSupportOrder
        : undefined,
      supportCollectionsUnit: childSupport
        ? data.supportCollectionsUnit
        : undefined,
      paysSpousalSupport: nameChange
        ? yesNo(data.paysSpousalSupport)
        : undefined,
      areSpousalSupportPaymentsUpToDate: spousalSupport
        ? yesNo(data.areSpousalSupportPaymentsUpToDate)
        : undefined,
      spousalSupportArrearsAmount:
        spousalSupport && data.areSpousalSupportPaymentsUpToDate === false
          ? data.spousalSupportArrearsAmount
          : undefined,
      courtIssuingSpousalSupportOrder: spousalSupport
        ? data.courtIssuingSpousalSupportOrder
        : undefined,
      hasPreviousNameChangeTrue:
        nameChange && data.hasPreviouslyFiledNameChange === true,
      hasPreviousNameChangeFalse:
        nameChange && data.hasPreviouslyFiledNameChange === false,
      previousNameChangeDetails:
        nameChange && data.hasPreviouslyFiledNameChange === true
          ? data.previousNameChangePetitionDetails
          : undefined,
      reasonForChangingName: nameChange
        ? data.reasonForChangingName
        : undefined,

      // Section B: optional details are included only when explicitly requested.
      newGender: sexChange ? data.newGender : undefined,
      hasPreviouslyFiledSexDesignationChange: sexChange
        ? yesNo(data.hasPreviouslyFiledSexDesignationChange)
        : undefined,
      previouslyFiledSexDesignationChangeDetails:
        sexChange && data.hasPreviouslyFiledSexDesignationChange === true
          ? data.previouslyFiledSexDesignationChangeDetails
          : undefined,
      isProvidingReasonForGenderChange: sexChange
        ? yesNo(data.isProvidingReasonForGenderChange)
        : undefined,
      reasonForGenderChange:
        sexChange && data.isProvidingReasonForGenderChange === true
          ? data.reasonForGenderChange
          : undefined,

      // Section C: all applicants. The address step collects US addresses.
      currentAge: age >= 0 ? String(age) : undefined,
      dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
      residenceAddress: residence ? `${residence}, United States` : undefined,
      shouldSealCourtRecord: yesNo(data.shouldSealCourtRecord),
      reasonToSealCourtRecord:
        data.shouldSealCourtRecord === true
          ? data.reasonToSealCourtRecord
          : undefined,
      hasAttachedSupportingDocuments: yesNo(
        data.hasAttachedSupportingDocuments,
      ),
      supportingDocumentsDetails:
        data.hasAttachedSupportingDocuments === true
          ? data.supportingDocumentsDetails
          : undefined,

      // Completed by the court or by the petitioner when signing.
      indexNumber: undefined,
      signatureDate: undefined,
      petitionDay: undefined,
      petitionMonth: undefined,
      petitionYearSuffix: undefined,
    };
  },
});
