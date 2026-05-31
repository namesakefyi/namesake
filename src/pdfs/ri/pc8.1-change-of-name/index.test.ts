import { describe, it } from "vitest";
import type { FormData } from "../../../constants/fields";
import { expectPdfFieldsMatch } from "../../utils/expectPdfFieldsMatch";
import pc8.1ChangeOfName from ".";

describe("Change of Name", () => {
  const testData: Partial<FormData> = {

    // TODO: map PDF fields to form data: Combo Box 1, 2, Combo Box 4, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, sign1, 35, 36, 37, 38, 39, 40, sign 2, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, Signature Field 4
  };

  it("maps all fields correctly to the PDF", async () => {
    await expectPdfFieldsMatch(pc8.1ChangeOfName, testData);
  });

  // Test any derived fields below
});

