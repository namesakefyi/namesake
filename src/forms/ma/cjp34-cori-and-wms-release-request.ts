import { definePdf } from "@/forms/utils";
import { formatDateMMDDYYYY, joinNames } from "@/utils/pdf-helpers";
import pdf from "./cjp34-cori-and-wms-release-request.pdf";

export default definePdf({
  id: "cjp34-cori-and-wms-release-request",
  title: "Court Activity Record Request Form",
  code: "CJP 34",
  jurisdiction: "MA",
  pdfPath: pdf,
  fields: (data) => ({
    county: data.residenceCounty,
    caseName: joinNames(
      data.oldFirstName,
      data.oldMiddleName,
      data.oldLastName,
    ),
    isChangeOfNameProceeding: true, // Constant
    oldName: joinNames(data.oldFirstName, data.oldMiddleName, data.oldLastName),
    dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
    mothersMaidenName: data.mothersMaidenName,
    otherNamesOrAliases: data.otherNamesOrAliases,
  }),
});
