import { describe, expect, it } from "vitest";
import { getPdfForm } from "../../utils";
import petitionToChangeNameOfAdult from "../cjp27-petition-to-change-name-of-adult";

describe("CJP27 Petition to Change Name of Adult", () => {
  const testData = {
    newFirstName: "Eva",
    newMiddleName: "K",
    newLastName: "Decker",
    oldFirstName: "Old",
    oldMiddleName: "M",
    oldLastName: "Name",
    birthplaceCity: "Boston",
    birthplaceState: "MA",
    residenceStreetAddress: "123 Main St",
    residenceCity: "Cambridge",
    residenceState: "MA",
    residenceCounty: "Suffolk",
    residenceZipCode: "02139",
    isMailingAddressDifferentFromResidence: true,
    mailingStreetAddress: "456 Post St",
    mailingCity: "Boston",
    mailingState: "MA",
    mailingZipCode: "02110",
    email: "test@example.com",
    phoneNumber: "555-555-5555",
    dateOfBirth: "1990-01-01",
    hasPreviousNameChange: false,
    pronouns: ["She/Her"],
  };

  it("maps fields correctly to the PDF", async () => {
    const form = await getPdfForm({
      pdf: petitionToChangeNameOfAdult,
      userData: testData,
    });

    // Division (County)
    expect(form.getTextField("county").getText()).toBe("Suffolk");

    // Verify fields
    expect(form.getTextField("newFirstName").getText()).toBe("Eva");
    expect(form.getTextField("newMiddleName").getText()).toBe("K");
    expect(form.getTextField("newLastName").getText()).toBe("Decker");
    expect(form.getTextField("oldFirstName").getText()).toBe("Old");
    expect(form.getTextField("oldMiddleName").getText()).toBe("M");
    expect(form.getTextField("oldLastName").getText()).toBe("Name");
    expect(form.getTextField("birthplaceCity").getText()).toBe("Boston");
    expect(form.getTextField("birthplaceState").getText()).toBe("MA");
    expect(form.getTextField("dateOfBirth").getText()).toBe("01/01/1990");

    // Address fields
    expect(form.getTextField("residenceStreetAddress").getText()).toBe(
      "123 Main St",
    );
    expect(form.getTextField("residenceCity").getText()).toBe("Cambridge");
    expect(form.getTextField("residenceState").getText()).toBe("MA");
    expect(form.getTextField("residenceZipCode").getText()).toBe("02139");

    // Mailing address fields
    expect(form.getTextField("mailingStreetAddress").getText()).toBe(
      "456 Post St",
    );
    expect(form.getTextField("mailingCity").getText()).toBe("Boston");
    expect(form.getTextField("mailingState").getText()).toBe("MA");
    expect(form.getTextField("mailingZipCode").getText()).toBe("02110");

    // Have you ever legally changed your name? Checked "no" by default
    expect(form.getCheckBox("hasPreviousNameChangeTrue").isChecked()).toBe(
      false,
    );
    expect(form.getCheckBox("hasPreviousNameChangeFalse").isChecked()).toBe(
      true,
    );
  });

  it("shows previous name change when it exists", async () => {
    const dataWithPreviousNameChange = {
      ...testData,
      hasPreviousNameChange: true,
      previousNameFrom: "Old Name",
      previousNameTo: "New Name",
      previousNameReason: "I changed my name because I wanted to",
    };

    const form = await getPdfForm({
      pdf: petitionToChangeNameOfAdult,
      userData: dataWithPreviousNameChange,
    });

    expect(form.getCheckBox("hasPreviousNameChangeTrue").isChecked()).toBe(
      true,
    );
    expect(form.getTextField("previousNameFrom").getText()).toBe("Old Name");
    expect(form.getTextField("previousNameTo").getText()).toBe("New Name");
    expect(form.getTextField("previousNameReason").getText()).toBe(
      "I changed my name because I wanted to",
    );
  });

  it("shows language when interpreter is needed", async () => {
    const dataWithInterpreter = {
      ...testData,
      isInterpreterNeeded: true,
      language: "es",
    };

    const form = await getPdfForm({
      pdf: petitionToChangeNameOfAdult,
      userData: dataWithInterpreter,
    });

    expect(form.getCheckBox("isInterpreterNeeded").isChecked()).toBe(true);
    expect(form.getTextField("language").getText()).toBe("Spanish");
  });

  it("does not show language when interpreter is not needed", async () => {
    const dataWithoutInterpreter = {
      ...testData,
      isInterpreterNeeded: false,
      language: "Spanish",
    };

    const form = await getPdfForm({
      pdf: petitionToChangeNameOfAdult,
      userData: dataWithoutInterpreter,
    });

    expect(form.getCheckBox("isInterpreterNeeded").isChecked()).toBe(false);
    expect(form.getTextField("language").getText()).toBe("");
  });

  it("shows pronouns when okay to share pronouns", async () => {
    const dataWithPronouns = {
      ...testData,
      isOkayToSharePronouns: true,
      pronouns: ["She/Her"],
    };

    const form = await getPdfForm({
      pdf: petitionToChangeNameOfAdult,
      userData: dataWithPronouns,
    });

    expect(form.getCheckBox("isOkayToSharePronouns").isChecked()).toBe(true);
    expect(form.getTextField("pronouns").getText()).toBe("She/Her");
  });

  it("does not show pronouns when not okay to share pronouns", async () => {
    const dataWithoutPronouns = {
      ...testData,
      isOkayToSharePronouns: false,
      pronouns: ["She/Her"],
    };

    const form = await getPdfForm({
      pdf: petitionToChangeNameOfAdult,
      userData: dataWithoutPronouns,
    });

    expect(form.getCheckBox("isOkayToSharePronouns").isChecked()).toBe(false);
    expect(form.getTextField("pronouns").getText()).toBe("");
  });

  it("shows other pronouns when they exist", async () => {
    const dataWithOtherPronouns = {
      ...testData,
      isOkayToSharePronouns: true,
      pronouns: ["She/Her"],
      otherPronouns: "Ze/Zir",
    };

    const form = await getPdfForm({
      pdf: petitionToChangeNameOfAdult,
      userData: dataWithOtherPronouns,
    });

    expect(form.getCheckBox("isOkayToSharePronouns").isChecked()).toBe(true);
    expect(form.getTextField("pronouns").getText()).toBe("She/Her, Ze/Zir");
  });
});
