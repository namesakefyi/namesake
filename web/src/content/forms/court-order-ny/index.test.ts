import { describe, expect, it } from "vitest";
import type { FormData } from "#constants/fields";
import { resolveFormVisibility } from "#lib/forms/formVisibility";
import form from ".";

const resolve = (data: Partial<FormData>) =>
  resolveFormVisibility(form.steps, data, form.pdfs);

const nameSteps = [
  "new-name",
  "birthplace",
  "convictions",
  "court-cases",
  "family",
  "child-support",
  "spousal-support",
  "previous-name-petition",
  "name-reason",
];
const sharedSteps = [
  "request-type",
  "current-name",
  "date-of-birth",
  "address",
  "court",
  "seal-record",
  "supporting-documents",
];

describe("New York question flow", () => {
  it("keeps US birth states separate from international regions", () => {
    const data = {
      nyCourtOrderRequest: "Name change",
      birthplaceCountry: "CA",
      birthplaceState: "NY",
      birthplaceRegion: "Ontario",
    };
    expect(resolve(data).visibleFields).not.toHaveProperty("birthplaceState");
    expect(resolve(data).visibleFields.birthplaceRegion).toBe("Ontario");
    const us = resolve({ ...data, birthplaceCountry: "US" }).visibleFields;
    expect(us.birthplaceState).toBe("NY");
    expect(us).not.toHaveProperty("birthplaceRegion");
  });
  it.each([
    ["Name change", true, false],
    ["Sex designation change", false, true],
    ["Both", true, true],
  ] as const)("shows the relevant sections for %s", (request, name, sex) => {
    const { visibleStepIds } = resolve({ nyCourtOrderRequest: request });
    for (const id of sharedSteps) expect(visibleStepIds).toContain(id);
    for (const id of nameSteps) {
      expect(visibleStepIds.includes(id)).toBe(name);
    }
    expect(visibleStepIds.includes("sex-designation")).toBe(sex);
  });

  it("excludes stale name-change answers when switching to sex designation only", () => {
    const { visibleFields } = resolve({
      nyCourtOrderRequest: "Sex designation change",
      oldFirstName: "Alex",
      newFirstName: "Taylor",
      hasBeenConvictedOfCrime: true,
      crime: "Old answer",
      newGender: "X",
    });
    expect(visibleFields.oldFirstName).toBe("Alex");
    expect(visibleFields.newGender).toBe("X");
    expect(visibleFields).not.toHaveProperty("newFirstName");
    expect(visibleFields).not.toHaveProperty("crime");
  });

  it("excludes follow-up answers after their controlling answers change", () => {
    const { visibleFields } = resolve({
      nyCourtOrderRequest: "Both",
      hasBeenConvictedOfCrime: false,
      courtOfConviction: "Old court",
      crime: "Old answer",
      paysChildSupport: false,
      areChildSupportPaymentsUpToDate: false,
      childSupportArrearsAmount: "500",
      courtIssuingChildSupportOrder: "Old court",
      paysSpousalSupport: true,
      areSpousalSupportPaymentsUpToDate: true,
      spousalSupportArrearsAmount: "500",
      shouldSealCourtRecord: false,
      reasonToSealCourtRecord: "Old reason",
      isProvidingReasonForGenderChange: false,
      reasonForGenderChange: "Old reason",
      hasPreviouslyFiledNameChange: false,
      previousNameChangePetitionDetails: "Old petition",
      hasPreviouslyFiledSexDesignationChange: false,
      previouslyFiledSexDesignationChangeDetails: "Old petition",
      hasAttachedSupportingDocuments: false,
      supportingDocumentsDetails: "Old documents",
    });
    for (const field of [
      "courtOfConviction",
      "crime",
      "areChildSupportPaymentsUpToDate",
      "childSupportArrearsAmount",
      "courtIssuingChildSupportOrder",
      "spousalSupportArrearsAmount",
      "reasonToSealCourtRecord",
      "reasonForGenderChange",
      "previousNameChangePetitionDetails",
      "previouslyFiledSexDesignationChangeDetails",
      "supportingDocumentsDetails",
    ])
      expect(visibleFields).not.toHaveProperty(field);
  });

  it.each([
    "hasFiledForBankruptcy",
    "hasJudgmentsOrLiens",
    "isPartyToLawsuitOrCourtCase",
  ] as const)("includes case details when %s is true", (field) => {
    expect(
      resolve({
        nyCourtOrderRequest: "Name change",
        [field]: true,
        bankruptcyJudgmentsLiensDetails: "Case details",
      }).visibleFields.bankruptcyJudgmentsLiensDetails,
    ).toBe("Case details");
  });

  it("does not reuse completed-name-change history as petition history", () => {
    const { visibleFields } = resolve({
      nyCourtOrderRequest: "Name change",
      hasPreviousNameChange: true,
      previousNameFrom: "Alex",
    });
    expect(visibleFields.hasPreviouslyFiledNameChange).toBeUndefined();
    expect(visibleFields).not.toHaveProperty("previousNameFrom");
  });
});
