import { describe, expect, it, vi } from "vitest";
import type { FormData } from "#constants/fields";
import { getPdfForm } from "#lib/pdfs/getPdfForm";
import pdf from ".";

const names: Partial<FormData> = {
  oldFirstName: "Alex",
  oldMiddleName: "J",
  oldLastName: "Example",
  newFirstName: "Taylor",
  newLastName: "Example",
};

describe("New York petition names and request type", () => {
  it.each([
    ["Name change", true, false],
    ["Sex designation change", false, true],
    ["Both", true, true],
  ] as const)("fills the PDF for %s", async (request, name, sex) => {
    // Include a saved new name to ensure sex-only requests do not use it.
    const form = await getPdfForm({
      pdf,
      userData: { ...names, nyCourtOrderRequest: request },
    });
    expect(form.getTextField("currentLegalName")?.getValue()).toBe(
      "Alex J Example",
    );
    expect(form.getCheckbox("isRequestingNameChange")?.isChecked()).toBe(name);
    expect(
      form.getCheckbox("isRequestingSexDesignationChange")?.isChecked(),
    ).toBe(sex);
    for (const [fieldName, checked] of [
      ["isRequestingNameChange", name],
      ["isRequestingSexDesignationChange", sex],
    ] as const) {
      const field = form.getCheckbox(fieldName);
      if (!field) throw new Error(`Missing checkbox: ${fieldName}`);
      expect(field.getWidgets()).toHaveLength(2);
      for (const widget of field.getWidgets()) {
        expect(widget.dict.getName("AS")?.value !== "Off").toBe(checked);
        expect(widget.dict.getName("V")).toBeUndefined();
      }
    }
    const newName = form.getTextField("newFullName")?.getValue();
    if (name) expect(newName).toBe("Taylor Example");
    else expect(newName ?? "").toBe("");
  });

  it("uses the existing name when no new name was collected", async () => {
    const form = await getPdfForm({
      pdf,
      userData: {
        nyCourtOrderRequest: "Sex designation change",
        oldFirstName: "Alex",
        oldLastName: "Example",
      },
    });
    expect(form.getTextField("currentLegalName")?.getValue()).toBe(
      "Alex Example",
    );
    expect(form.getTextField("newFullName")?.getValue() ?? "").toBe("");
  });
});

const complete: Partial<FormData> = {
  ...names,
  nyCourtOrderRequest: "Both",
  courtType: "Supreme",
  courtCounty: "Kings",
  dateOfBirth: "1990-06-15",
  residenceStreetAddress: "123 Example Street",
  residenceStreetAddress2: "Apt 4",
  residenceCity: "Brooklyn",
  residenceState: "NY",
  residenceZipCode: "11201",
  residenceCounty: "Queens",
  birthplaceStreetAddress: "1 Hospital Road",
  birthplaceCity: "Boston",
  birthplaceState: "MA",
  birthplaceCountry: "US",
  birthplaceZipCode: "02108",
  hasBeenConvictedOfCrime: true,
  courtOfConviction: "Example Court",
  crime: "Example conviction",
  hasFiledForBankruptcy: true,
  hasJudgmentsOrLiens: true,
  isPartyToLawsuitOrCourtCase: true,
  bankruptcyJudgmentsLiensDetails: "Example Court, 2020, case 123",
  isCurrentlyMarried: true,
  wasPreviouslyMarried: true,
  hasChildrenUnder21: true,
  paysChildSupport: true,
  areChildSupportPaymentsUpToDate: false,
  childSupportArrearsAmount: "1250.50",
  courtIssuingChildSupportOrder: "Example Family Court",
  supportCollectionsUnit: "Kings County SCU",
  paysSpousalSupport: true,
  areSpousalSupportPaymentsUpToDate: false,
  spousalSupportArrearsAmount: "0",
  courtIssuingSpousalSupportOrder: "Example Supreme Court",
  hasPreviouslyFiledNameChange: true,
  previousNameChangePetitionDetails: "Example Court, 2021, case 456, withdrawn",
  reasonForChangingName: "This is the name I use.",
  newGender: "X",
  hasPreviouslyFiledSexDesignationChange: true,
  previouslyFiledSexDesignationChangeDetails:
    "Example Court, 2022, case 789, withdrawn",
  isProvidingReasonForGenderChange: true,
  reasonForGenderChange: "To reflect my gender identity.",
  shouldSealCourtRecord: true,
  reasonToSealCourtRecord: "For my personal safety.",
  hasAttachedSupportingDocuments: true,
  supportingDocumentsDetails: "Certified birth certificate",
};

const nameRadios = [
  "hasBeenConvictedOfCrime",
  "hasFiledForBankruptcy",
  "hasJudgmentsOrLiens",
  "isPartyToLawsuitOrCourtCase",
  "isCurrentlyMarried",
  "wasPreviouslyMarried",
  "hasChildrenUnder21",
  "paysChildSupport",
  "areChildSupportPaymentsUpToDate",
  "paysSpousalSupport",
  "areSpousalSupportPaymentsUpToDate",
] as const;
const sexRadios = [
  "hasPreviouslyFiledSexDesignationChange",
  "isProvidingReasonForGenderChange",
] as const;
const radios = [
  ...nameRadios,
  ...sexRadios,
  "shouldSealCourtRecord",
  "hasAttachedSupportingDocuments",
] as const;
const nameText = [
  "newFullName",
  "placeOfBirth",
  "courtOfConviction",
  "crime",
  "bankruptcyJudgmentsLiensDetails",
  "childSupportArrearsAmount",
  "courtIssuingChildSupportOrder",
  "supportCollectionsUnit",
  "spousalSupportArrearsAmount",
  "courtIssuingSpousalSupportOrder",
  "previousNameChangeDetails",
  "reasonForChangingName",
] as const;
const sexText = [
  "newGender",
  "previouslyFiledSexDesignationChangeDetails",
  "reasonForGenderChange",
] as const;

describe("New York petition field mapping", () => {
  it("derives the age at download time", () => {
    vi.setSystemTime(new Date(2026, 5, 14));
    try {
      expect(pdf.resolver(complete).currentAge).toBe("35");
      vi.setSystemTime(new Date(2026, 5, 15));
      expect(pdf.resolver(complete).currentAge).toBe("36");
    } finally {
      vi.useRealTimers();
    }
  });

  it.each(["dontKnow", "preferNotToAnswer"] as const)(
    "does not turn %s into a yes or no answer",
    (answer) => {
      const result = pdf.resolver({
        ...complete,
        shouldSealCourtRecord: answer,
      });
      expect(result.shouldSealCourtRecord).toBeUndefined();
      expect(result.reasonToSealCourtRecord).toBeUndefined();
    },
  );
  it("fills every collected answer in the saved PDF", async () => {
    const form = await getPdfForm({ pdf, userData: complete });
    const expectedText = {
      currentLegalName: "Alex J Example",
      newFullName: "Taylor Example",
      courtType: "Supreme",
      county: "Kings",
      dateOfBirth: "06/15/1990",
      residenceAddress:
        "123 Example Street, Apt 4, Brooklyn, NY, 11201, United States",
      placeOfBirth:
        "1 Hospital Road, Boston, MA, 02108, United States of America",
      courtOfConviction: complete.courtOfConviction,
      crime: complete.crime,
      bankruptcyJudgmentsLiensDetails: complete.bankruptcyJudgmentsLiensDetails,
      childSupportArrearsAmount: "1250.50",
      courtIssuingChildSupportOrder: complete.courtIssuingChildSupportOrder,
      supportCollectionsUnit: complete.supportCollectionsUnit,
      spousalSupportArrearsAmount: "0",
      courtIssuingSpousalSupportOrder: complete.courtIssuingSpousalSupportOrder,
      previousNameChangeDetails: complete.previousNameChangePetitionDetails,
      reasonForChangingName: complete.reasonForChangingName,
      newGender: "X",
      previouslyFiledSexDesignationChangeDetails:
        complete.previouslyFiledSexDesignationChangeDetails,
      reasonForGenderChange: complete.reasonForGenderChange,
      reasonToSealCourtRecord: complete.reasonToSealCourtRecord,
      supportingDocumentsDetails: complete.supportingDocumentsDetails,
    };
    for (const [name, expected] of Object.entries(expectedText)) {
      expect(form.getTextField(name)?.getValue(), name).toBe(expected);
    }
    for (const name of radios) {
      expect(form.getRadioGroup(name)?.getValue(), name).toBe(
        complete[name] ? "Yes" : "No",
      );
    }
    expect(form.getCheckbox("hasPreviousNameChangeTrue")?.isChecked()).toBe(
      true,
    );
    expect(form.getCheckbox("hasPreviousNameChangeFalse")?.isChecked()).toBe(
      false,
    );
    for (const name of [
      "signatureDate",
      "petitionDay",
      "petitionMonth",
      "petitionYearSuffix",
      "indexNumber",
    ]) {
      expect((form.getTextField(name)?.getValue() ?? "").trim(), name).toBe("");
    }
  });

  it.each([true, false])(
    "selects exactly the printed %s radio button",
    async (answer) => {
      const userData = {
        ...complete,
        ...Object.fromEntries(radios.map((name) => [name, answer])),
      };
      // Both support-payment questions must be visible to exercise their radios.
      userData.paysChildSupport = true;
      userData.paysSpousalSupport = true;
      const form = await getPdfForm({ pdf, userData });
      for (const name of radios) {
        const field = form.getRadioGroup(name);
        if (!field) throw new Error(`Missing radio: ${name}`);
        const expectedYes = userData[name] === true;
        expect(field.getOptions().sort(), name).toEqual(["No", "Yes"]);
        expect(field.getValue(), name).toBe(expectedYes ? "Yes" : "No");
        const widgets = field
          .getWidgets()
          .sort((a, b) => a.rect[0] - b.rect[0]);
        expect(
          widgets.map((w) => w.dict.getName("AS")?.value),
          name,
        ).toEqual(expectedYes ? ["Yes", "Off"] : ["Off", "No"]);
      }
    },
  );

  it("leaves unanswered questions and personal information blank", async () => {
    const form = await getPdfForm({
      pdf,
      userData: { nyCourtOrderRequest: "Both" },
    });
    for (const name of radios) {
      const field = form.getRadioGroup(name);
      if (!field) throw new Error(`Missing radio: ${name}`);
      expect(field.getValue(), name).toBeNull();
      expect(
        field.getWidgets().every((w) => w.dict.getName("AS")?.value === "Off"),
        name,
      ).toBe(true);
    }
    for (const name of [
      "hasPreviousNameChangeTrue",
      "hasPreviousNameChangeFalse",
    ]) {
      expect(form.getCheckbox(name)?.isChecked(), name).toBe(false);
    }
    for (const name of [
      "currentAge",
      "dateOfBirth",
      "residenceAddress",
      "placeOfBirth",
    ]) {
      expect((form.getTextField(name)?.getValue() ?? "").trim(), name).toBe("");
    }
  });

  it.each(["Name change", "Sex designation change"])(
    "omits the other section for %s, even with stale answers",
    async (request) => {
      const form = await getPdfForm({
        pdf,
        userData: { ...complete, nyCourtOrderRequest: request },
      });
      const sexOnly = request === "Sex designation change";
      for (const name of sexOnly ? nameText : sexText) {
        expect((form.getTextField(name)?.getValue() ?? "").trim(), name).toBe(
          "",
        );
      }
      for (const name of sexOnly ? nameRadios : sexRadios) {
        expect(form.getRadioGroup(name)?.getValue(), name).toBeNull();
      }
      if (sexOnly) {
        expect(form.getCheckbox("hasPreviousNameChangeTrue")?.isChecked()).toBe(
          false,
        );
        expect(
          form.getCheckbox("hasPreviousNameChangeFalse")?.isChecked(),
        ).toBe(false);
      }
    },
  );

  it("does not print hidden details after an answer changes to no", async () => {
    const form = await getPdfForm({
      pdf,
      userData: {
        ...complete,
        ...Object.fromEntries(radios.map((name) => [name, false])),
        hasPreviouslyFiledNameChange: false,
      },
    });
    for (const name of [
      "courtOfConviction",
      "crime",
      "bankruptcyJudgmentsLiensDetails",
      "childSupportArrearsAmount",
      "courtIssuingChildSupportOrder",
      "supportCollectionsUnit",
      "spousalSupportArrearsAmount",
      "courtIssuingSpousalSupportOrder",
      "previousNameChangeDetails",
      "previouslyFiledSexDesignationChangeDetails",
      "reasonForGenderChange",
      "reasonToSealCourtRecord",
      "supportingDocumentsDetails",
    ])
      expect((form.getTextField(name)?.getValue() ?? "").trim(), name).toBe("");
    expect(
      form.getRadioGroup("areChildSupportPaymentsUpToDate")?.getValue(),
    ).toBeNull();
    expect(
      form.getRadioGroup("areSpousalSupportPaymentsUpToDate")?.getValue(),
    ).toBeNull();
    expect(form.getCheckbox("hasPreviousNameChangeTrue")?.isChecked()).toBe(
      false,
    );
    expect(form.getCheckbox("hasPreviousNameChangeFalse")?.isChecked()).toBe(
      true,
    );
  });

  it("omits stale arrears when payments are up to date", () => {
    const result = pdf.resolver({
      ...complete,
      areChildSupportPaymentsUpToDate: true,
      areSpousalSupportPaymentsUpToDate: true,
    });
    expect(result.childSupportArrearsAmount).toBeUndefined();
    expect(result.spousalSupportArrearsAmount).toBeUndefined();
    expect(result.courtIssuingChildSupportOrder).toBe(
      complete.courtIssuingChildSupportOrder,
    );
  });

  it("uses the international birthplace region instead of a saved US state", () => {
    const result = pdf.resolver({
      ...complete,
      birthplaceStreetAddress: "10 Example Road",
      birthplaceCity: "Toronto",
      birthplaceRegion: "Ontario",
      birthplaceCountry: "CA",
      birthplaceZipCode: "M5V 1A1",
    });
    expect(result.placeOfBirth).toBe(
      "10 Example Road, Toronto, Ontario, M5V 1A1, Canada",
    );
  });
});
