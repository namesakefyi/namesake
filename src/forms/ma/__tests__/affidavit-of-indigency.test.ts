import { describe, expect, it } from "vitest";
import { getPdfForm } from "../../utils";
import affidavitOfIndigency from "../affidavit-of-indigency";

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
    const form = await getPdfForm({
      pdf: affidavitOfIndigency,
      userData: testData,
    });

    expect(form.getTextField("applicantName").getText()).toBe("Alex J Smith");
    expect(form.getTextField("residenceStreetAddress").getText()).toBe(
      "789 Elm St",
    );
    expect(form.getTextField("residenceCity").getText()).toBe("Springfield");
    expect(form.getTextField("residenceStateAndZip").getText()).toBe(
      "MA 01103",
    );
  });
});
