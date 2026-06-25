import { definePdf } from "#lib/pdfs/definePdf";
import { formatAddress } from "#lib/utils/formatAddress";
import { formatDateMMDDYYYY } from "#lib/utils/formatDateMMDDYYYY";
import { joinNames } from "#lib/utils/joinNames";
import pdf from "./background-check-authorization-of-release.pdf";
import type { PdfFieldName } from "./schema";

export default definePdf<PdfFieldName>({
  id: "background-check-authorization-of-release",
  title: "Background Check Authorization of Release",
  jurisdiction: "ri",
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
