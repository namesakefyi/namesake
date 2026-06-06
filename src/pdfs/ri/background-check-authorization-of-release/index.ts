import { formatAddress } from "../../../utils/formatAddress";
import { formatDateMMDDYYYY } from "../../../utils/formatDateMMDDYYYY";
import { joinNames } from "../../../utils/joinNames";
import { definePdf } from "../../utils/definePdf";
import pdf from "./background-check-authorization-of-release.pdf";
import type { PdfFieldName } from "./schema";

export default definePdf<PdfFieldName>({
  id: "background-check-authorization-of-release",
  title: "Background Check Authorization of Release",
  jurisdiction: "RI",
  canonicalUrl: "https://riag.ri.gov/media/3906/download",
  pdfPath: pdf,
  resolver: (data) => ({
    fullName: joinNames(
      data.oldFirstName,
      data.oldMiddleName,
      data.oldLastName,
    ),
    otherNames:
      [
        data.previousNameFrom,
        joinNames(data.newFirstName, data.newMiddleName, data.newLastName),
      ]
        .filter(Boolean)
        .join(", ") || undefined,
    dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
    residenceAddress: formatAddress({
      street: data.residenceStreetAddress,
      city: data.residenceCity,
      state: data.residenceState,
      zip: data.residenceZipCode,
    }),
    nameChange: "Legal name change",
  }),
});
