import { describe, it } from "vitest";
import type { FormData } from "#constants/fields";
import { expectPdfFieldsMatch } from "#lib/pdfs/expectPdfFieldsMatch";
import pc81ChangeOfName from ".";

describe("Change of Name", () => {
  const testData: Partial<FormData> = {
    oldFirstName: "My",
    oldMiddleName: "Old",
    oldLastName: "Name",
    newFirstName: "Marsha",
    newMiddleName: "P",
    newLastName: "Johnson",
    residenceStreetAddress: "100 Main St",
    residenceCity: "Providence",
    residenceState: "ri",
    residenceZipCode: "02903",
    phoneNumber: "+1 (234) 567-8901",
    email: "test@email.com",
    dateOfBirth: "1970-01-01",
    birthplaceCity: "Providence",
    birthplaceCountry: "US",
    birthplaceState: "ri",
    mothersFirstName: "Mary",
    mothersMiddleName: "Ann",
    mothersLastName: "Maiden",
    fathersFirstName: "John",
    fathersMiddleName: "Paul",
    fathersLastName: "Smith",
    occupation: "Software Engineer",
    maritalStatus: "Single",
    previousAddresses: [
      "100 Main St, Providence, RI 02903",
      "45 Oak Ave, Cranston, RI 02910",
    ],
    reasonForChangingName:
      "I want a name which aligns with my gender identity.",
    shouldChangeBirthCertificate: true,
  };

  it("maps all fields correctly to the PDF", async () => {
    await expectPdfFieldsMatch(pc81ChangeOfName, testData);
  });
});
