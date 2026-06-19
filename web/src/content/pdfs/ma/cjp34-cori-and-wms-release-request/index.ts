import { definePdf } from "#lib/pdfs/definePdf";
import { formatDateMMDDYYYY } from "#lib/utils/formatDateMMDDYYYY";
import { joinNames } from "#lib/utils/joinNames";
import pdf from "./cjp34-cori-and-wms-release-request.pdf";
import type { PdfFieldName } from "./schema";

export default definePdf<PdfFieldName>({
  id: "cjp34-cori-and-wms-release-request",
  title: "Court Activity Record Request Form",
  code: "CJP-34",
  jurisdiction: "MA",
  canonicalUrl:
    "https://www.mass.gov/doc/court-activity-record-information-and-warrant-management-system-release-request-form-cjp-34/download",
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
    ssnFirstThree: undefined,
    ssnMiddleTwo: undefined,
    ssnLastFour: undefined,
  }),
});
