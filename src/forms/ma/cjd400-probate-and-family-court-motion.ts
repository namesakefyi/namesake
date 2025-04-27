import { definePdf } from "@/forms/utils";
import { joinNames } from "@/utils/pdf-helpers";
import pdf from "./cjd400-probate-and-family-court-motion.pdf";

export default definePdf({
  id: "cjd400-probate-and-family-court-motion",
  title: "Probate and Family Court Motion",
  code: "CJD 400",
  jurisdiction: "MA",
  pdfPath: pdf,
  fields: (data) => ({
    division: data.residenceCounty,
    petitionerName: joinNames(
      data.oldFirstName,
      data.oldMiddleName,
      data.oldLastName,
    ),
    date: new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }),
    residenceStreetAddress: data.residenceStreetAddress,
    residenceCity: data.residenceCity,
    residenceState: data.residenceState,
    residenceZipCode: data.residenceZipCode,
    phoneNumber: data.phoneNumber,

    // TODO: Add remaining fields
  }),
});
