import { describe, expect, it } from "vitest";
import { getPdfForm } from "../../utils";
import motionToImpoundRecords from "../cjd400-motion-to-impound";

describe("CJD400 Motion to Impound Records", () => {
  const testData = {
    oldFirstName: "Old",
    oldMiddleName: "M",
    oldLastName: "Name",
    newFirstName: "New",
    newMiddleName: "N",
    newLastName: "Name",
    residenceCounty: "Suffolk",
    residenceStreetAddress: "123 Main St",
    residenceCity: "Cambridge",
    residenceState: "MA",
    residenceZipCode: "02139",
    phoneNumber: "555-555-5555",
    reasonToImpoundCourtRecords: "Personal safety concerns",
  };

  it("maps all fields correctly to the PDF", async () => {
    const form = await getPdfForm({
      pdf: motionToImpoundRecords,
      userData: testData,
    });

    // Get today's date in MM/DD/YYYY format for comparison
    const today = new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    // Division fields
    expect(form.getTextField("division").getText()).toBe("Suffolk");
    expect(form.getTextField("division2").getText()).toBe("Suffolk");

    // Petitioner name
    expect(form.getTextField("petitionerName").getText()).toBe("Old M Name");

    // Motion for fields
    expect(form.getTextField("motionFor").getText()).toBe(
      "Impound Entire Case",
    );
    expect(form.getTextField("motionFor2").getText()).toBe("Old M Name");
    expect(form.getTextField("motionForPageTwo").getText()).toBe(
      "Impound Entire Case",
    );

    // Date fields
    expect(form.getTextField("date").getText()).toBe(today);
    expect(form.getTextField("dated").getText()).toBe(today);

    // Current legal name
    expect(form.getTextField("currentLegalName").getText()).toBe("Old M Name");

    // Petitioner checkbox
    expect(form.getCheckBox("petitioner").isChecked()).toBe(true);

    // Request (reason)
    expect(form.getTextField("request").getText()).toBe(
      "Personal safety concerns",
    );

    // Print name
    expect(form.getTextField("printName").getText()).toBe("Old M Name");

    // Address fields
    expect(form.getTextField("residenceStreetAddress").getText()).toBe(
      "123 Main St",
    );
    expect(form.getTextField("residenceCity").getText()).toBe("Cambridge");
    expect(form.getTextField("residenceState").getText()).toBe("MA");
    expect(form.getTextField("residenceZip").getText()).toBe("02139");

    // Phone number
    expect(form.getTextField("phoneNumber").getText()).toBe("555-555-5555");
  });
});
