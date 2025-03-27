import { definePdf } from "@/utils/pdf";
import { joinNames } from "@/utils/pdf-helpers";

export default definePdf({
  title: "Affidavit of Indigency",
  pdfPath: "/forms/ma/affidavit-of-indigency.pdf",
  jurisdiction: "MA",
  fields: (data: {
    newFirstName: string;
    newMiddleName: string;
    newLastName: string;
    residenceStreetAddress: string;
    residenceCity: string;
    residenceState: string;
    residenceZipCode: string;
  }) => ({
    "Name of applicant": joinNames(
      data.newFirstName,
      data.newMiddleName,
      data.newLastName,
    ),
    "Street and number": data.residenceStreetAddress,
    "City or town": data.residenceCity,
    "State and Zip": `${data.residenceState} ${data.residenceZipCode}`,
  }),
});
