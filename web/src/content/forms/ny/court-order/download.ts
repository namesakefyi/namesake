import { COUNTRIES } from "#constants/countries";
import ucsnc1 from "#content/pdfs/ny/ucsnc1-name-change-and-or-sex-designation-change-petition-for-individual-adult";
import { defineDownload } from "#lib/forms/defineForm";
import { formatCurrentAge } from "#lib/utils/deriveCurrentAge";
import { asText } from "#lib/utils/fieldValue";
import { formatAddress } from "#lib/utils/formatAddress";
import { formatDateMMDDYYYY } from "#lib/utils/formatDateMMDDYYYY";
import { fullName } from "#lib/utils/fullName";
import { requestsNameChange, requestsSexDesignationChange } from "./steps";

export default defineDownload({
  title: "New York Court Order",
  instructions: [
    "Sign and date the petition in both places on the last page. You don’t need a notary.",
    "File your petition with the court clerk in the county where you live.",
  ],
  pdfs: [
    {
      pdf: ucsnc1,
      fill: (data) => {
        const residence = formatAddress({
          street: data.residenceStreetAddress,
          street2: data.residenceStreetAddress2,
          city: data.residenceCity,
          state: data.residenceState,
          zip: data.residenceZipCode,
        });

        return {
          // Only New York City residents are asked; everyone else files in Supreme Court.
          courtType: data.courtType ?? "Supreme",
          county: data.residenceCounty,
          currentLegalName: fullName(data, "oldName"),
          isRequestingNameChange: requestsNameChange(data),
          isRequestingSexDesignationChange: requestsSexDesignationChange(data),

          // Hidden answers are removed by resolveFormVisibility before submission.
          newFullName: fullName(data, "newName"),
          placeOfBirth: formatAddress({
            city: data.birthplaceCity,
            state: data.birthplaceState,
            region: asText(data.birthplaceRegion),
            country:
              data.birthplaceCountry && COUNTRIES[data.birthplaceCountry],
          }),
          hasBeenConvictedOfCrime: data.hasBeenConvictedOfCrime,
          courtOfConviction: data.courtOfConviction,
          crime: data.crime,
          hasFiledForBankruptcy: data.hasFiledForBankruptcy,
          hasJudgmentsOrLiens: data.hasJudgmentsOrLiens,
          isPartyToLawsuitOrCourtCase: data.isPartyToLawsuitOrCourtCase,
          bankruptcyJudgmentsLiensDetails: data.bankruptcyJudgmentsLiensDetails,
          isCurrentlyMarried: data.isCurrentlyMarried,
          wasPreviouslyMarried: data.wasPreviouslyMarried,
          hasChildrenUnder21: data.hasChildrenUnder21,
          paysChildSupport: data.doesPayChildSupport,
          areChildSupportPaymentsUpToDate: data.areChildSupportPaymentsUpToDate,
          childSupportArrearsAmount: data.childSupportArrearsAmount,
          courtIssuingChildSupportOrder: data.courtIssuingChildSupportOrder,
          supportCollectionsUnit: data.supportCollectionsUnit,
          paysSpousalSupport: data.doesPaySpousalSupport,
          areSpousalSupportPaymentsUpToDate:
            data.areSpousalSupportPaymentsUpToDate,
          spousalSupportArrearsAmount: data.spousalSupportArrearsAmount,
          courtIssuingSpousalSupportOrder: data.courtIssuingSpousalSupportOrder,
          hasPreviousNameChangeTrue: data.hasPreviouslyFiledNameChange === true,
          hasPreviousNameChangeFalse:
            data.hasPreviouslyFiledNameChange === false,
          previousNameChangeDetails: data.previousNameChangePetitionDetails,
          reasonForChangingName: data.reasonForChangingName,

          newGender: data.newGender,
          hasPreviouslyFiledSexDesignationChange:
            data.hasPreviouslyFiledSexDesignationChange,
          previouslyFiledSexDesignationChangeDetails:
            data.previouslyFiledSexDesignationChangeDetails,
          isProvidingReasonForGenderChange:
            data.isProvidingReasonForGenderChange,
          reasonForGenderChange: data.reasonForGenderChange,

          // Section C: all applicants. The address step collects US addresses.
          currentAge: formatCurrentAge(data.dateOfBirth),
          dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
          residenceAddress: residence
            ? `${residence}, United States`
            : undefined,
          shouldSealCourtRecord: data.shouldSealCourtRecord,
          reasonToSealCourtRecord: data.reasonToSealCourtRecord,
          hasAttachedSupportingDocuments: data.hasAttachedSupportingDocuments,
          supportingDocumentsDetails: data.supportingDocumentsDetails,

          // Completed by the court or by the petitioner when signing.
          indexNumber: undefined,
          signatureDate: undefined,
          petitionDay: undefined,
          petitionMonth: undefined,
          petitionYearSuffix: undefined,
        };
      },
    },
  ],
});
