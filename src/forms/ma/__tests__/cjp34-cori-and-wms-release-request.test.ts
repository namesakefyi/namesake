import { describe, expect, it } from "vitest";
import { getPdfForm } from "../../utils";
import coriAndWmsReleaseRequest from "../cjp34-cori-and-wms-release-request";

describe("CJP34 CORI and WMS Release Request", () => {
  const testData = {
    residenceCounty: "Suffolk",
    oldFirstName: "Old",
    oldMiddleName: "M",
    oldLastName: "Name",
    dateOfBirth: "1990-01-01",
    mothersMaidenName: "Smith",
    otherNamesOrAliases: "Nickname, Alias",
  } as const;

  it("maps all fields correctly to the PDF", async () => {
    const form = await getPdfForm({
      pdf: coriAndWmsReleaseRequest,
      userData: testData,
    });

    // Verify fields
    expect(form.getTextField("caseName").getText()).toBe("Old M Name");
    expect(form.getTextField("county").getText()).toBe("Suffolk");
    expect(form.getTextField("oldName").getText()).toBe("Old M Name");
    expect(form.getTextField("dateOfBirth").getText()).toBe("01/01/1990");
    expect(form.getTextField("mothersMaidenName").getText()).toBe("Smith");
    expect(form.getTextField("otherNamesOrAliases").getText()).toBe(
      "Nickname, Alias",
    );

    // Verify constant checkbox
    expect(form.getCheckBox("isChangeOfNameProceeding").isChecked()).toBe(true);
  });

  it("handles missing optional fields", async () => {
    const partialData = {
      oldFirstName: "Old",
      oldLastName: "Name",
      dateOfBirth: "1990-01-01",
    };

    const form = await getPdfForm({
      pdf: coriAndWmsReleaseRequest,
      userData: partialData,
    });

    expect(form.getTextField("oldName").getText()).toBe("Old Name");
    expect(form.getTextField("mothersMaidenName").getText()).toBeUndefined();
    expect(form.getTextField("otherNamesOrAliases").getText()).toBeUndefined();
  });
});
