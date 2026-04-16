import { describe, it } from "vitest";
import { expectPdfFieldsMatch } from "../../utils/expectPdfFieldsMatch";
import affidavitOfIndigency from ".";

describe("Affidavit of Indigency", () => {
  const testData = {
    oldFirstName: "Alex",
    oldMiddleName: "J",
    oldLastName: "Smith",
    residenceStreetAddress: "789 Elm St",
    residenceCity: "Springfield",
    residenceState: "MA",
    residenceZipCode: "01103",
  };

  it("maps all fields correctly to the PDF", async () => {
    await expectPdfFieldsMatch(affidavitOfIndigency, testData);
  });
});
