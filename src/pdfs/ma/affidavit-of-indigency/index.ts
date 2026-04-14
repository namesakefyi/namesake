import { joinNames } from "../../../utils/joinNames";
import { definePdf } from "../../utils/definePdf";
import pdf from "./affidavit-of-indigency.pdf";
import type { PdfFieldName } from "./schema";

export default definePdf<PdfFieldName>({
  id: "affidavit-of-indigency",
  title: "Affidavit of Indigency",
  jurisdiction: "MA",
  pdfPath: pdf,
  resolver: (data) => ({
    applicantName: joinNames(
      data.oldFirstName,
      data.oldMiddleName,
      data.oldLastName,
    ),
    residenceStreetAddress: data.residenceStreetAddress,
    residenceCity: data.residenceCity,
    residenceStateAndZip: `${data.residenceState} ${data.residenceZipCode}`,
  }),
});
