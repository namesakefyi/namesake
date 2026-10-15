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
      isRequestingNameChange: requestsNameChange(data),
      isRequestingSexDesignationChange: requestsSexDesignationChange(data),

      // Hidden answers are removed by resolveFormVisibility before submission.
      newFullName: joinNames(
        data.newFirstName,
        data.newMiddleName,
        data.newLastName,
      ),
      placeOfBirth: [
        data.birthplaceStreetAddress,
        data.birthplaceCity,
        data.birthplaceState?.toUpperCase() ?? data.birthplaceRegion,
        data.birthplaceZipCode,
        data.birthplaceCountry ? COUNTRIES[data.birthplaceCountry] : undefined,
      ]
        .filter(Boolean)
        .join(", "),
      hasBeenConvictedOfCrime: yesNo(data.hasBeenConvictedOfCrime),
      courtOfConviction: data.courtOfConviction,
      crime: data.crime,
      hasFiledForBankruptcy: yesNo(data.hasFiledForBankruptcy),
      hasJudgmentsOrLiens: yesNo(data.hasJudgmentsOrLiens),
      isPartyToLawsuitOrCourtCase: yesNo(data.isPartyToLawsuitOrCourtCase),
      bankruptcyJudgmentsLiensDetails: data.bankruptcyJudgmentsLiensDetails,
      isCurrentlyMarried: yesNo(data.isCurrentlyMarried),
      wasPreviouslyMarried: yesNo(data.wasPreviouslyMarried),
      hasChildrenUnder21: yesNo(data.hasChildrenUnder21),
      paysChildSupport: yesNo(data.paysChildSupport),
      areChildSupportPaymentsUpToDate: yesNo(
        data.areChildSupportPaymentsUpToDate,
      ),
      childSupportArrearsAmount: data.childSupportArrearsAmount,
      courtIssuingChildSupportOrder: data.courtIssuingChildSupportOrder,
      supportCollectionsUnit: data.supportCollectionsUnit,
      paysSpousalSupport: yesNo(data.paysSpousalSupport),
      areSpousalSupportPaymentsUpToDate: yesNo(
        data.areSpousalSupportPaymentsUpToDate,
      ),
      spousalSupportArrearsAmount: data.spousalSupportArrearsAmount,
      courtIssuingSpousalSupportOrder: data.courtIssuingSpousalSupportOrder,
      hasPreviousNameChangeTrue: data.hasPreviouslyFiledNameChange === true,
      hasPreviousNameChangeFalse: data.hasPreviouslyFiledNameChange === false,
      previousNameChangeDetails: data.previousNameChangePetitionDetails,
      reasonForChangingName: data.reasonForChangingName,

      newGender: data.newGender,
      hasPreviouslyFiledSexDesignationChange: yesNo(
        data.hasPreviouslyFiledSexDesignationChange,
      ),
      previouslyFiledSexDesignationChangeDetails:
        data.previouslyFiledSexDesignationChangeDetails,
      isProvidingReasonForGenderChange: yesNo(
        data.isProvidingReasonForGenderChange,
      ),
      reasonForGenderChange: data.reasonForGenderChange,

      // Section C: all applicants. The address step collects US addresses.
      currentAge: age >= 0 ? String(age) : undefined,
      dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
      residenceAddress: residence ? `${residence}, United States` : undefined,
      shouldSealCourtRecord: yesNo(data.shouldSealCourtRecord),
      reasonToSealCourtRecord: data.reasonToSealCourtRecord,
      hasAttachedSupportingDocuments: yesNo(
        data.hasAttachedSupportingDocuments,
      ),
      supportingDocumentsDetails: data.supportingDocumentsDetails,

      // Completed by the court or by the petitioner when signing.
      indexNumber: undefined,
      signatureDate: undefined,
      petitionDay: undefined,
      petitionMonth: undefined,
      petitionYearSuffix: undefined,
    };
  },
});
