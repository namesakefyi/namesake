import { describe, it } from "vitest";
import { expectPdfFieldsMatch } from "#lib/pdfs/expectPdfFieldsMatch";
import affidavitOfIndigency from ".";

describe("Affidavit of Indigency", () => {
  const testData = {
    oldFirstName: "Alex",
    oldMiddleName: "J",
    oldLastName: "Smith",
    residenceStreetAddress: "789 Elm St",
    residenceCity: "Springfield",
    residenceState: "ma",
    residenceZipCode: "01103",
  };

  it("maps all fields correctly to the PDF", async () => {
    await expectPdfFieldsMatch(affidavitOfIndigency, testData);
  });
});
