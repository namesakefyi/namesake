import { describe, expect, it } from "vitest";
import { PREFER_NOT_TO_ANSWER } from "#constants/fields";
import { expectPdfFieldsMatch } from "#lib/pdfs/expectPdfFieldsMatch";
import { getPdfForm } from "#lib/pdfs/getPdfForm";
import ss5Application from ".";

describe("SS-5 Application for Social Security Card", () => {
  const testData = {
    // Field 1: Name
    newFirstName: "Marsha",
    newMiddleName: "P",
    newLastName: "Johnson",
    oldFirstName: "Malcolm",
    oldMiddleName: "M",
    oldLastName: "Michaels, Jr.",
    previousLegalNames: "Black Marsha",

    // Field 3: Birthplace
    birthplaceCity: "Elizabeth",
    birthplaceState: "NJ",

    // Field 4: Date of Birth
    dateOfBirth: "1945-08-24",

    // Field 5: Citizenship
    citizenshipStatus: "usCitizen",

    // Field 6: Ethnicity
    isHispanicOrLatino: false,

    // Field 7: Race
    race: ["black"],

    // Field 8: Sex
    sexAssignedAtBirth: "male",

    // Field 9: Mother's name
    mothersFirstName: "Alberta",
    mothersMiddleName: "M",
    mothersLastName: "Michaels",

    // Field 10: Father's name
    fathersFirstName: "Malcolm",
    fathersMiddleName: "F",
    fathersLastName: "Michaels, Sr.",

    // Field 11: Previous Social Security Card
    hasPreviousSocialSecurityCard: true,

    // Field 12: Previous Social Security Card name
    previousSocialSecurityCardFirstName: "Malcolm",
    previousSocialSecurityCardMiddleName: "M",
    previousSocialSecurityCardLastName: "Michaels, Jr.",

    // Field 15: Phone number (area code split into separate field by resolver)
    phoneNumber: "212-867-5309",

    // Field 16: Address
    mailingStreetAddress: "123 Main St",
    mailingCity: "New York",
    mailingState: "NY",
    mailingZipCode: "10001",

    // Field 18: Relationship
    isFilingForSomeoneElse: false,
    relationshipToFilingFor: "self",
  };

  it("maps all fields correctly to the PDF", async () => {
    await expectPdfFieldsMatch(ss5Application, testData);
  });

  it("splits phone number into area code and local number", async () => {
    const form = await getPdfForm({ pdf: ss5Application, userData: testData });
    expect(form.getTextField("areaCode")?.getValue()).toBe("212");
    expect(form.getTextField("phoneNumber")?.getValue()).toBe("867-5309");
  });

  it("checks previousSocialSecurityCardUnknown when hasPreviousSocialSecurityCard is unknown", async () => {
    const form = await getPdfForm({
      pdf: ss5Application,
      userData: {
        ...testData,
        hasPreviousSocialSecurityCard: PREFER_NOT_TO_ANSWER,
      },
    });
    expect(
      form.getCheckbox("previousSocialSecurityCardUnknown")?.isChecked(),
    ).toBe(true);
    expect(form.getCheckbox("hasPreviousSocialSecurityCard")?.isChecked()).toBe(
      false,
    );
    expect(
      form.getCheckbox("hasNoPreviousSocialSecurityCard")?.isChecked(),
    ).toBe(false);
  });

  it("derives birthplaceState from country code when outside US", async () => {
    const dataWithForeignBirthplace = {
      ...testData,
      birthplaceCity: "Toronto",
      birthplaceCountry: "CA",
      birthplaceState: undefined,
    };

    const form = await getPdfForm({
      pdf: ss5Application,
      userData: dataWithForeignBirthplace,
    });

    expect(form.getTextField("birthplaceState")?.getValue()).toBe("Canada");
  });
});
