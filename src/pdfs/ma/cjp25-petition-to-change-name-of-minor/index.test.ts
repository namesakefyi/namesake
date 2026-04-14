import { afterEach, describe, expect, it, vi } from "vitest";
import type { FormData } from "../../../constants/fields";
import { expectPdfFieldsMatch } from "../../utils/expectPdfFieldsMatch";
import { getPdfForm } from "../../utils/getPdfForm";
import cjp25PetitionToChangeNameOfMinor from ".";

describe("Petition to Change Name of Minor", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  const testData: Partial<FormData> = {
    oldFirstName: "Old",
    oldMiddleName: "M",
    oldLastName: "Name",
    newFirstName: "New",
    newMiddleName: "N",
    newLastName: "Name",
    birthplaceCity: "Boston",
    birthplaceState: "MA",
    dateOfBirth: "2015-06-15",
    residenceCounty: "Suffolk",
    residenceStreetAddress: "456 Post St",
    residenceCity: "Boston",
    residenceState: "MA",
    residenceZipCode: "02110",
    isOkayToSharePronouns: true,
    pronouns: ["she/her"],
    otherPronouns: "Ze/Zir",
    isPresentedByLegalMotherParent1: true,
    isPresentedByLegalFatherParent2: false,
    isPresentedByCourtAppointedGuardian: true,
    parent1FullName: "Jane Doe",
    parent1StreetAddress: "123 Parent St",
    parent1City: "Cambridge",
    parent1State: "MA",
    parent1ZipCode: "02139",
    parent1Phone: "555-111-1111",
    parent1Email: "parent1@example.com",
    parent2FullName: "John Doe",
    parent2StreetAddress: "456 Father Ave",
    parent2City: "Somerville",
    parent2State: "MA",
    parent2ZipCode: "02144",
    parent2Phone: "555-222-2222",
    parent2Email: "parent2@example.com",
    isParent1Assenting: false,
    parent1DissentReason: "Parent 1 unavailable",
    isParent2Assenting: false,
    parent2DissentReason: "Parent 2 objects",
    hasCourtAppointedGuardian: true,
    guardianFullName: "Guardian Smith",
    guardianStreetAddress: "789 Guardian Ln",
    guardianCity: "Quincy",
    guardianState: "MA",
    guardianZipCode: "02169",
    guardianPhone: "555-333-3333",
    guardianEmail: "guardian@example.com",
    coGuardianFullName: "Co-Guardian Jones",
    coGuardianStreetAddress: "321 CoGuardian St",
    coGuardianCity: "Worcester",
    coGuardianState: "MA",
    coGuardianZipCode: "01608",
    coGuardianPhone: "555-444-4444",
    coGuardianEmail: "coguardian@example.com",
    isAllGuardiansAssenting: false,
    guardianDissentReason: "Guardian unavailable",
    hasPreviousNameChange: true,
    previousNameFrom: "Old Name",
    previousNameTo: "New Name",
    previousNameReason: "Marriage",
    shouldReturnOriginalDocuments: true,
    areBothParentsListedOnBirthCertificate: false,
    isALegalParentDeceased: false,
    hasLegalParentHadParentalRightsTerminated: false,
    isUnderSupervisionOfMassDeptOfYouthServices: false,
    reasonForChangingName: "Preferred name",
    isInterpreterNeededForChild: true,
    isInterpreterNeededForParent1: false,
    isInterpreterNeededForParent2: false,
    isInterpreterNeededForGuardian: false,
    language: "es",
  };

  it("maps all fields correctly to the PDF", async () => {
    vi.setSystemTime(new Date(2025, 5, 15)); // Jun 15, 2025 — child turns 10
    await expectPdfFieldsMatch(cjp25PetitionToChangeNameOfMinor, testData);
  });

  it("derives isChildUnder12 true when child is under 12", async () => {
    vi.setSystemTime(new Date(2025, 5, 15));
    const form = await getPdfForm({
      pdf: cjp25PetitionToChangeNameOfMinor,
      userData: testData, // dateOfBirth 2015-06-15 → age 10
    });
    expect(form.getCheckBox("isChildUnder12").isChecked()).toBe(true);
  });

  it("derives isChildUnder12 false when child is 12 or older", async () => {
    vi.setSystemTime(new Date(2025, 5, 15));
    const dataWithOlderChild = {
      ...testData,
      dateOfBirth: "2012-01-01", // 13 years old — isChildUnder12 becomes false
    };

    const form = await getPdfForm({
      pdf: cjp25PetitionToChangeNameOfMinor,
      userData: dataWithOlderChild,
    });

    expect(form.getCheckBox("isChildUnder12").isChecked()).toBe(false);
  });

  it("derives hasPreviousNameChangeFalse when no previous name change", async () => {
    vi.setSystemTime(new Date(2025, 5, 15));
    const dataWithNoPreviousChange = {
      ...testData,
      hasPreviousNameChange: false,
    };
    const form = await getPdfForm({
      pdf: cjp25PetitionToChangeNameOfMinor,
      userData: dataWithNoPreviousChange,
    });
    expect(form.getCheckBox("hasPreviousNameChangeTrue").isChecked()).toBe(
      false,
    );
    expect(form.getCheckBox("hasPreviousNameChangeFalse").isChecked()).toBe(
      true,
    );
  });

  it("derives hasCourtAppointedGuardianFalse when no guardian", async () => {
    vi.setSystemTime(new Date(2025, 5, 15));
    const dataWithNoGuardian = {
      ...testData,
      hasCourtAppointedGuardian: false,
    };
    const form = await getPdfForm({
      pdf: cjp25PetitionToChangeNameOfMinor,
      userData: dataWithNoGuardian,
    });
    expect(form.getCheckBox("hasCountAppointedGuardianFalse").isChecked()).toBe(
      true,
    );
    expect(form.getCheckBox("hasCourtAppointedGuardianTrue").isChecked()).toBe(
      false,
    );
    expect(form.getCheckBox("hasNoCountAppointedGuardian").isChecked()).toBe(
      true,
    );
  });

  it("derives isOnlyOneParentListedOnBirthCertificate when both listed", async () => {
    vi.setSystemTime(new Date(2025, 5, 15));
    const dataWithBothParents = {
      ...testData,
      areBothParentsListedOnBirthCertificate: true,
    };
    const form = await getPdfForm({
      pdf: cjp25PetitionToChangeNameOfMinor,
      userData: dataWithBothParents,
    });
    expect(
      form.getCheckBox("isOnlyOneParentListedOnBirthCertificate").isChecked(),
    ).toBe(false);
  });
});
