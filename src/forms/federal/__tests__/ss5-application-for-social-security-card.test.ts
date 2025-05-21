import { describe, expect, it } from "vitest";
import { getPdfForm } from "../../utils";
import ss5Application from "../ss5-application-for-social-security-card";

describe("SS-5 Application for Social Security Card", () => {
  const testData = {
    // Field 1: Name
    newFirstName: "Eva",
    newMiddleName: "K",
    newLastName: "Decker",
    oldFirstName: "Old",
    oldMiddleName: "M",
    oldLastName: "Name",
    previousLegalNames: "Previous Name",

    // Field 3: Birthplace
    birthplaceCity: "Boston",
    birthplaceState: "MA",

    // Field 4: Date of Birth
    dateOfBirth: "1990-01-01",

    // Field 5: Citizenship
    citizenshipStatus: "usCitizen",

    // Field 6: Ethnicity
    isHispanicOrLatino: true,

    // Field 7: Race
    race: ["white", "asian"],

    // Field 8: Sex
    sexAssignedAtBirth: "female",

    // Field 9: Mother's name
    mothersFirstName: "Mother",
    mothersMiddleName: "M",
    mothersLastName: "Name",

    // Field 10: Father's name
    fathersFirstName: "Father",
    fathersMiddleName: "F",
    fathersLastName: "Name",

    // Field 11: Previous Social Security Card
    hasPreviousSocialSecurityCard: true,

    // Field 12: Previous Social Security Card name
    previousSocialSecurityCardFirstName: "Previous",
    previousSocialSecurityCardMiddleName: "P",
    previousSocialSecurityCardLastName: "Name",

    // Field 15: Phone number
    phoneNumber: "555-555-5555",

    // Field 16: Address
    mailingStreetAddress: "123 Main St",
    mailingCity: "Boston",
    mailingState: "MA",
    mailingZipCode: "02110",

    // Field 18: Relationship
    isFilingForSomeoneElse: false,
    relationshipToFilingFor: "self",
  };

  it("maps all fields correctly to the PDF", async () => {
    const form = await getPdfForm({
      pdf: ss5Application,
      userData: testData,
    });

    // Get today's date in MM/DD/YYYY format for comparison
    const today = new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    // Field 1: Name
    expect(form.getTextField("newFirstName").getText()).toBe("Eva");
    expect(form.getTextField("newMiddleName").getText()).toBe("K");
    expect(form.getTextField("newLastName").getText()).toBe("Decker");
    expect(form.getTextField("oldFirstName").getText()).toBe("Old");
    expect(form.getTextField("oldMiddleName").getText()).toBe("M");
    expect(form.getTextField("oldLastName").getText()).toBe("Name");
    expect(form.getTextField("otherNames").getText()).toBe("Previous Name");

    // Field 3: Birthplace
    expect(form.getTextField("birthplaceCity").getText()).toBe("Boston");
    expect(form.getTextField("birthplaceState").getText()).toBe("MA");

    // Field 4: Date of Birth
    expect(form.getTextField("dateOfBirth").getText()).toBe("01/01/1990");

    // Field 5: Citizenship
    expect(form.getCheckBox("usCitizen").isChecked()).toBe(true);
    expect(form.getCheckBox("legalAlienAllowedToWork").isChecked()).toBe(false);
    expect(form.getCheckBox("legalAlienNotAllowedToWork").isChecked()).toBe(
      false,
    );
    expect(form.getCheckBox("citizenshipOther").isChecked()).toBe(false);

    // Field 6: Ethnicity
    expect(form.getCheckBox("isHispanicOrLatino").isChecked()).toBe(true);
    expect(form.getCheckBox("isNotHispanicOrLatino").isChecked()).toBe(false);

    // Field 7: Race
    expect(form.getCheckBox("isWhite").isChecked()).toBe(true);
    expect(form.getCheckBox("isAsian").isChecked()).toBe(true);
    expect(form.getCheckBox("isBlack").isChecked()).toBe(false);
    expect(form.getCheckBox("isNativeHawaiian").isChecked()).toBe(false);
    expect(form.getCheckBox("isAlaskaNative").isChecked()).toBe(false);
    expect(form.getCheckBox("isAmericanIndian").isChecked()).toBe(false);
    expect(form.getCheckBox("isOtherPacificIslander").isChecked()).toBe(false);

    // Field 8: Sex
    expect(form.getCheckBox("isFemale").isChecked()).toBe(true);
    expect(form.getCheckBox("isMale").isChecked()).toBe(false);

    // Field 9: Mother's name
    expect(form.getTextField("mothersFirstName").getText()).toBe("Mother");
    expect(form.getTextField("mothersMiddleName").getText()).toBe("M");
    expect(form.getTextField("mothersLastName").getText()).toBe("Name");

    // Field 10: Father's name
    expect(form.getTextField("fathersFirstName").getText()).toBe("Father");
    expect(form.getTextField("fathersMiddleName").getText()).toBe("F");
    expect(form.getTextField("fathersLastName").getText()).toBe("Name");

    // Field 11: Previous Social Security Card
    expect(form.getCheckBox("hasPreviousSocialSecurityCard").isChecked()).toBe(
      true,
    );
    expect(
      form.getCheckBox("hasNoPreviousSocialSecurityCard").isChecked(),
    ).toBe(false);

    // Field 12: Previous Social Security Card name
    expect(
      form.getTextField("previousSocialSecurityCardFirstName").getText(),
    ).toBe("Previous");
    expect(
      form.getTextField("previousSocialSecurityCardMiddleName").getText(),
    ).toBe("P");
    expect(
      form.getTextField("previousSocialSecurityCardLastName").getText(),
    ).toBe("Name");

    // Field 14: Today's date
    expect(form.getTextField("todaysDate").getText()).toBe(today);

    // Field 15: Phone number
    expect(form.getTextField("phoneNumber").getText()).toBe("555-555-5555");

    // Field 16: Address
    expect(form.getTextField("mailingStreetAddress").getText()).toBe(
      "123 Main St",
    );
    expect(form.getTextField("mailingCity").getText()).toBe("Boston");
    expect(form.getTextField("mailingState").getText()).toBe("MA");
    expect(form.getTextField("mailingZipCode").getText()).toBe("02110");

    // Field 18: Relationship
    expect(form.getCheckBox("isSelf").isChecked()).toBe(true);
    expect(form.getCheckBox("isParent").isChecked()).toBe(false);
    expect(form.getCheckBox("isGuardian").isChecked()).toBe(false);
    expect(form.getCheckBox("isFilingOther").isChecked()).toBe(false);
  });

  it("handles different citizenship statuses", async () => {
    const dataWithLegalAlien = {
      ...testData,
      citizenshipStatus: "legalAlienAllowedToWork",
    };

    const form = await getPdfForm({
      pdf: ss5Application,
      userData: dataWithLegalAlien,
    });

    expect(form.getCheckBox("usCitizen").isChecked()).toBe(false);
    expect(form.getCheckBox("legalAlienAllowedToWork").isChecked()).toBe(true);
    expect(form.getCheckBox("legalAlienNotAllowedToWork").isChecked()).toBe(
      false,
    );
    expect(form.getCheckBox("citizenshipOther").isChecked()).toBe(false);
  });

  it("handles different relationship types", async () => {
    const dataWithParent = {
      ...testData,
      isFilingForSomeoneElse: true,
      relationshipToFilingFor: "parent",
    };

    const form = await getPdfForm({
      pdf: ss5Application,
      userData: dataWithParent,
    });

    expect(form.getCheckBox("isSelf").isChecked()).toBe(false);
    expect(form.getCheckBox("isParent").isChecked()).toBe(true);
    expect(form.getCheckBox("isGuardian").isChecked()).toBe(false);
    expect(form.getCheckBox("isFilingOther").isChecked()).toBe(false);
  });

  it("handles other relationship type with specification", async () => {
    const dataWithOther = {
      ...testData,
      isFilingForSomeoneElse: true,
      relationshipToFilingFor: "other",
      relationshipToFilingForOther: "Aunt",
    };

    const form = await getPdfForm({
      pdf: ss5Application,
      userData: dataWithOther,
    });

    expect(form.getCheckBox("isSelf").isChecked()).toBe(false);
    expect(form.getCheckBox("isParent").isChecked()).toBe(false);
    expect(form.getCheckBox("isGuardian").isChecked()).toBe(false);
    expect(form.getCheckBox("isFilingOther").isChecked()).toBe(true);
    expect(form.getTextField("otherSpecify").getText()).toBe("Aunt");
  });
});
