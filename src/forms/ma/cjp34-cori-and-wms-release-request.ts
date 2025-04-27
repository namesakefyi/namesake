import { definePdf } from "@/forms/utils";
import { joinNames } from "@/utils/pdf-helpers";
import pdf from "./cjp34-cori-and-wms-release-request.pdf";

export default definePdf({
  id: "cjp34-cori-and-wms-release-request",
  title:
    "Court Activity Record Information and Warrant Management System Release Request Form",
  code: "CJP 34",
  jurisdiction: "MA",
  pdfPath: pdf,
  fields: (data) => ({
    county: data.residenceCounty,
    isChangeOfNameProceeding: true, // Constant
    oldName: joinNames(data.oldFirstName, data.oldMiddleName, data.oldLastName),
    dateOfBirth: data.dateOfBirth,
    mothersMaidenName: data.mothersMaidenName,
    otherNamesOrAliases: data.otherNamesOrAliases,
  }),
});
