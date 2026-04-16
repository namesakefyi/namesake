import { describe, it } from "vitest";
import { expectPdfFieldsMatch } from "../../utils/expectPdfFieldsMatch";
import coriAndWmsReleaseRequest from ".";

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
    await expectPdfFieldsMatch(coriAndWmsReleaseRequest, testData);
  });
});
