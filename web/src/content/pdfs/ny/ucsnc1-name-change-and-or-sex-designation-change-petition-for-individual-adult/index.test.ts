import { describe, it } from "vitest";
import type { FormData } from "#constants/fields";
import { expectPdfFieldsMatch } from "#lib/pdfs/expectPdfFieldsMatch";
import ucsnc1NameChangeAndOrSexDesignationChangePetitionForIndividualAdult from ".";

describe("Name Change and/or Sex Designation Change Petition for Individual Adult", () => {
  const testData: Partial<FormData> = {
    // TODO: map PDF fields to form data: shouldSealCourtRecord, hasBeenConvictedOfCrime, reasonToSealCourtRecord, reasonForChangingName, courtOfConviction, courtType, crime, county, hasFiledForBankruptcy, currentLegalName, indexNumber, hasJudgmentsOrLiens, isPartyToLawsuitOrCourtCase, hasAttachedSupportingDocuments, isRequestingNameChange, isRequestingSexDesignationChange, bankruptcyJudgmentsLiensDetails, supportingDocumentsDetails, newGender, hasPreviouslyFiledSexDesignationChange, previouslyFiledSexDesignationChangeDetails, isCurrentlyMarried, wasPreviouslyMarried, hasChildrenUnder21, isProvidingReasonForGenderChange, paysChildSupport, signatureDate, areChildSupportPaymentsUpToDate, reasonForGenderChange, childSupportArrearsAmount, newFullName, courtIssuingChildSupportOrder, petitionDay, petitionMonth, supportCollectionsUnit, petitionYearSuffix, placeOfBirth, paysSpousalSupport, areSpousalSupportPaymentsUpToDate, spousalSupportArrearsAmount, courtIssuingSpousalSupportOrder, hasPreviousNameChangeTrue, hasPreviousNameChangeFalse, currentAge, dateOfBirth, previousNameChangeDetails, residenceAddress
  };

  it("maps all fields correctly to the PDF", async () => {
    await expectPdfFieldsMatch(
      ucsnc1NameChangeAndOrSexDesignationChangePetitionForIndividualAdult,
      testData,
    );
  });

  // Test any derived fields below
});
