import { definePdf } from "@/forms/utils";
import { joinNames } from "@/utils/pdf-helpers";
import pdf from "./cjd400-motion-to-waive-publication.pdf";

export default definePdf({
  id: "cjd400-motion-to-impound-records",
  title: "Motion to Impound Records",
  code: "CJD 400",
  jurisdiction: "MA",
  pdfPath: pdf,
  fields: (data) => ({
    division: data.residenceCounty,
    division2: data.residenceCounty,
    petitionerName: joinNames(
      data.oldFirstName,
      data.oldMiddleName,
      data.oldLastName,
    ),
    motionFor: "Impound Entire Case",
    motionFor2: joinNames(
      data.oldFirstName,
      data.oldMiddleName,
      data.oldLastName,
    ),
    date: new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }),
    currentLegalName: joinNames(
      data.oldFirstName,
      data.oldMiddleName,
      data.oldLastName,
    ),
    petitioner: true,
    request: data.reasonToImpoundCourtRecords,
    printName: joinNames(
      data.oldFirstName,
      data.oldMiddleName,
      data.oldLastName,
    ),
    residenceStreetAddress: data.residenceStreetAddress,
    residenceCity: data.residenceCity,
    residenceState: data.residenceState,
    residenceZip: data.residenceZipCode,
    phoneNumber: data.phoneNumber,
    motionForPageTwo: "Impound Entire Case",
    dated: new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }),
  }),
});
