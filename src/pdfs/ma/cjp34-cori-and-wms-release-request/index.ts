import { formatDateMMDDYYYY } from "../../../utils/formatDateMMDDYYYY";
import { joinNames } from "../../../utils/joinNames";
import { definePdf } from "../../utils/definePdf";
import pdf from "./cjp34-cori-and-wms-release-request.pdf";
import type { PdfFieldName } from "./schema";

export default definePdf<PdfFieldName>({
  id: "cjp34-cori-and-wms-release-request",
  title: "Court Activity Record Request Form",
  code: "CJP-34",
  jurisdiction: "MA",
  pdfPath: pdf,
  resolver: (data) => ({
    county: data.residenceCounty,
    caseName: joinNames(
      data.oldFirstName,
      data.oldMiddleName,
      data.oldLastName,
    ),
    isChangeOfNameProceeding: true,
    oldName: joinNames(data.oldFirstName, data.oldMiddleName, data.oldLastName),
    dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
    mothersMaidenName: data.mothersMaidenName,
    otherNamesOrAliases: data.otherNamesOrAliases,
  }),
});
