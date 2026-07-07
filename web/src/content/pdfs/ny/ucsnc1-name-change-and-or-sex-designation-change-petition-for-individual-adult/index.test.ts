import { describe, it } from "vitest";
import type { FormData } from "#constants/fields";
import { expectPdfFieldsMatch } from "#lib/pdfs/expectPdfFieldsMatch";
import ucsnc1NameChangeAndOrSexDesignationChangePetitionForIndividualAdult from ".";

describe("Name Change and/or Sex Designation Change Petition for Individual Adult", () => {
  const testData: Partial<FormData> = {
    // TODO: map PDF fields to form data: Reset_Form, SealingRequest, ConvictedOfCrime, SealingRequest-specify, reasonForChangingName, CourtOfConviction, CourtType, Crime, county, Bankruptcy, currentLegalName, IndexNumber, JudgmentsOrLiens, PartyToAction, SupportingDocument, NameChange, SexDesignationChange, BankruptcyJudgmentsLiensParty-specify, SupportingDocument-specify, newGender, PreviousSexDesignationChangeRequest, PreviousSexDesignationChangeRequest-specify, CurrentlyMarried, PreviouslyMarried, ChildrenUnder21, ReasonsForSexDesignationChangeRequest, ChildSupport, SignatureDate, ChildSupportPayments, ReasonsForSexDesignationChangeRequest-specify, ChildSupportArrears, newFullName, CourtIssuingChildSupportOrder, AffirmDay, AffirmMonth, SupportCollectionsUnit, AffirmYear, placeOfBirth, SpousalSupport, SpousalSupportPayments, SpousalSupportArrears, CourtIssuingSpousalSupportOrder, PreviousNameChangePetition, PreviousNameChangePetition0, currentAge, dateOfBirth, Print_Form, PreviousNameChagePetition-specify, residenceAddress
  };

  it("maps all fields correctly to the PDF", async () => {
    await expectPdfFieldsMatch(
      ucsnc1NameChangeAndOrSexDesignationChangePetitionForIndividualAdult,
      testData,
    );
  });

  // Test any derived fields below
});
