import { describe, expect, it, vi } from "vitest";
import ucsnc1 from "#content/pdfs/ny/ucsnc1-name-change-and-or-sex-designation-change-petition-for-individual-adult";
import {
  getVisibleStepIds,
  resolveFormVisibility,
} from "#lib/forms/formVisibility";
import type { FormData } from "#lib/forms/questions";
import { getPdfForm } from "#lib/pdfs/getPdfForm";
import download from "./download";
import steps from "./steps";

const [{ fill: fillUcsnc1 }] = download.pdfs;

/** Also takes answers saved by other forms. */
const resolve = (data: FormData) => resolveFormVisibility(steps, data);

const nameSteps = [
  "new-name",
  "birthplace",
  "convictions",
  "court-cases",
  "family",
  "support-payments",
  "previous-name-petition",
  "name-reason",
];
const sharedSteps = [
  "request-type",
  "current-name",
  "date-of-birth",
  "address",
  "seal-record",
  "supporting-documents",
];

describe("New York question flow", () => {
  it("keeps US birth states separate from international regions", () => {
    const data: FormData = {
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
    const visibleStepIds = getVisibleStepIds(steps, {
      nyCourtOrderRequest: request,
    });
    for (const id of sharedSteps) expect(visibleStepIds).toContain(id);
    for (const id of nameSteps) {
      expect(visibleStepIds.includes(id)).toBe(name);
    }
    expect(visibleStepIds.includes("sex-designation")).toBe(sex);
  });

  it("asks which court to file in only for New York City residents", () => {
    const stepsFor = (residenceCounty: string) =>
      getVisibleStepIds(steps, {
        nyCourtOrderRequest: "Both",
        residenceCounty,
      });
    expect(stepsFor("Kings")).toContain("court");
    expect(stepsFor("Albany")).not.toContain("court");
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
      doesPayChildSupport: false,
      areChildSupportPaymentsUpToDate: false,
      childSupportArrearsAmount: "500",
      courtIssuingChildSupportOrder: "Old court",
      doesPaySpousalSupport: true,
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

// The same filtering downloadFormPacket applies before filling.
const visibleAnswers = (data: FormData) =>
  resolveFormVisibility(steps, data).visibleFields;

const getPetitionForm = (userData: FormData) =>
  getPdfForm(ucsnc1, fillUcsnc1(visibleAnswers(userData)));

const names: FormData = {
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
    const form = await getPetitionForm({
      ...names,
      nyCourtOrderRequest: request,
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
    const form = await getPetitionForm({
      nyCourtOrderRequest: "Sex designation change",
      oldFirstName: "Alex",
      oldLastName: "Example",
    });
    expect(form.getTextField("currentLegalName")?.getValue()).toBe(
      "Alex Example",
    );
    expect(form.getTextField("newFullName")?.getValue() ?? "").toBe("");
  });
});

const complete: FormData = {
  ...names,
  nyCourtOrderRequest: "Both",
  courtType: "Civil",
  dateOfBirth: "1990-06-15",
  residenceStreetAddress: "123 Example Street",
  residenceStreetAddress2: "Apt 4",
  residenceCity: "Brooklyn",
  residenceState: "NY",
  residenceZipCode: "11201",
  residenceCounty: "Queens",
  birthplaceCity: "Boston",
  birthplaceState: "MA",
  birthplaceCountry: "US",
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
  doesPayChildSupport: true,
  areChildSupportPaymentsUpToDate: false,
  childSupportArrearsAmount: "1250.50",
  courtIssuingChildSupportOrder: "Example Family Court",
  supportCollectionsUnit: "Kings County SCU",
  doesPaySpousalSupport: true,
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

/** The PDF names radios whose answers were renamed. */
const PDF_NAMES: Record<string, string> = {
  doesPayChildSupport: "paysChildSupport",
  doesPaySpousalSupport: "paysSpousalSupport",
};
const pdfName = (field: string) => PDF_NAMES[field] ?? field;

const nameRadios = [
  "hasBeenConvictedOfCrime",
  "hasFiledForBankruptcy",
  "hasJudgmentsOrLiens",
  "isPartyToLawsuitOrCourtCase",
  "isCurrentlyMarried",
  "wasPreviouslyMarried",
  "hasChildrenUnder21",
  "doesPayChildSupport",
  "areChildSupportPaymentsUpToDate",
  "doesPaySpousalSupport",
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
      expect(fillUcsnc1(visibleAnswers(complete)).currentAge).toBe("35");
      vi.setSystemTime(new Date(2026, 5, 15));
      expect(fillUcsnc1(visibleAnswers(complete)).currentAge).toBe("36");
    } finally {
      vi.useRealTimers();
    }
  });

  it("fills every collected answer in the saved PDF", async () => {
    const form = await getPetitionForm(complete);
    const expectedText = {
      currentLegalName: "Alex J Example",
      newFullName: "Taylor Example",
      courtType: "Civil",
      county: "Queens",
      dateOfBirth: "06/15/1990",
      residenceAddress:
        "123 Example Street, Apt 4, Brooklyn, NY, 11201, United States",
      placeOfBirth: "Boston, MA, United States of America",
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
      expect(form.getRadioGroup(pdfName(name))?.getValue(), name).toBe(
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
      userData.doesPayChildSupport = true;
      userData.doesPaySpousalSupport = true;
      const form = await getPetitionForm(userData);
      for (const name of radios) {
        const field = form.getRadioGroup(pdfName(name));
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
    const form = await getPetitionForm({ nyCourtOrderRequest: "Both" });
    for (const name of radios) {
      const field = form.getRadioGroup(pdfName(name));
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

  it.each(["Name change", "Sex designation change"] as const)(
    "omits the other section for %s, even with stale answers",
    async (request) => {
      const form = await getPetitionForm({
        ...complete,
        nyCourtOrderRequest: request,
      });
      const sexOnly = request === "Sex designation change";
      for (const name of sexOnly ? nameText : sexText) {
        expect((form.getTextField(name)?.getValue() ?? "").trim(), name).toBe(
          "",
        );
      }
      for (const name of sexOnly ? nameRadios : sexRadios) {
        expect(form.getRadioGroup(pdfName(name))?.getValue(), name).toBeNull();
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
    const form = await getPetitionForm({
      ...complete,
      ...Object.fromEntries(radios.map((name) => [name, false])),
      hasPreviouslyFiledNameChange: false,
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
    const result = fillUcsnc1(
      visibleAnswers({
        ...complete,
        areChildSupportPaymentsUpToDate: true,
        areSpousalSupportPaymentsUpToDate: true,
      }),
    );
    expect(result.childSupportArrearsAmount).toBeUndefined();
    expect(result.spousalSupportArrearsAmount).toBeUndefined();
    expect(result.courtIssuingChildSupportOrder).toBe(
      complete.courtIssuingChildSupportOrder,
    );
  });

  it("uses the chosen court in New York City and Supreme Court elsewhere", () => {
    expect(fillUcsnc1(visibleAnswers(complete)).courtType).toBe("Civil");
    const outsideCity = fillUcsnc1(
      visibleAnswers({ ...complete, residenceCounty: "Albany" }),
    );
    expect(outsideCity.courtType).toBe("Supreme");
    expect(outsideCity.county).toBe("Albany");
  });

  it("uses the international birthplace region instead of a saved US state", () => {
    const result = fillUcsnc1(
      visibleAnswers({
        ...complete,
        birthplaceCity: "Toronto",
        birthplaceRegion: "Ontario",
        birthplaceCountry: "CA",
      }),
    );
    expect(result.placeOfBirth).toBe("Toronto, Ontario, Canada");
  });
});
