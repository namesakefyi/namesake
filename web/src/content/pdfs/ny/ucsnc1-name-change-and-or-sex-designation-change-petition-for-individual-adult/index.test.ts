import { describe, it } from "vitest";
import type { FormData } from "#constants/fields";
import { expectPdfFieldsMatch } from "#lib/pdfs/expectPdfFieldsMatch";
import ucsnc1NameChangeAndOrSexDesignationChangePetitionForIndividualAdult from ".";

describe("Name Change and/or Sex Designation Change Petition for Individual Adult", () => {
  const testData: Partial<FormData> = {
    // TODO: map PDF fields to form data: Reset_Form, SealingRequest, ConvictedOfCrime, SealingRequest-specify, ReasonsForNameChangeRequest-specify, CourtOfConviction, CourtType, Crime, County, Bankruptcy, PetitionerName, IndexNumber, JudgmentsOrLiens, PartyToAction, SupportingDocument, NameChange, SexDesignationChange, BankruptcyJudgmentsLiensParty-specify, SupportingDocument-specify, NewSexDesignation, PreviousSexDesignationChangeRequest, PreviousSexDesignationChangeRequest-specify, CurrentlyMarried, PreviouslyMarried, ChildrenUnder21, ReasonsForSexDesignationChangeRequest, ChildSupport, SignatureDate, ChildSupportPayments, ReasonsForSexDesignationChangeRequest-specify, ChildSupportArrears, NewName, CourtIssuingChildSupportOrder, AffirmDay, AffirmMonth, SupportCollectionsUnit, AffirmYear, PlaceOfBirth, SpousalSupport, SpousalSupportPayments, SpousalSupportArrears, CourtIssuingSpousalSupportOrder, PreviousNameChangePetition, PreviousNameChangePetition0, Age, DOB, Print_Form, PreviousNameChagePetition-specify, CurrentAddress
  };

  it("maps all fields correctly to the PDF", async () => {
    await expectPdfFieldsMatch(
      ucsnc1NameChangeAndOrSexDesignationChangePetitionForIndividualAdult,
      testData,
    );
  });

  // Test any derived fields below
});
