import { describe, it } from "vitest";
import type { FormData } from "../../../constants/fields";
import { expectPdfFieldsMatch } from "../../utils/expectPdfFieldsMatch";
import petitionToChangeNameOfAdult from ".";

describe("CJP27 Petition to Change Name of Adult", () => {
  const testData: Partial<FormData> = {
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
    hasPreviousNameChange: true,
    previousNameFrom: "Old Name",
    previousNameTo: "New Name",
    previousNameReason: "I changed my name because I wanted to",
    hasUsedOtherNameOrAlias: true,
    otherNamesOrAliases: "Nickname, Alias",
    shouldReturnOriginalDocuments: true,
    reasonForChangingName: "Preferred name",
    isInterpreterNeeded: true,
    language: "es",
    isOkayToSharePronouns: true,
    pronouns: ["she/her"],
    otherPronouns: "Ze/Zir",
  };

  it("maps all fields correctly to the PDF", async () => {
    await expectPdfFieldsMatch(petitionToChangeNameOfAdult, testData);
  });
});
