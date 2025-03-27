import { definePdf } from "@/utils/pdf";
import { joinNames } from "@/utils/pdf-helpers";
import pdf from "./cjp34-cori-and-wms-release-request.pdf";

export default definePdf({
  title:
    "Court Activity Record Information and Warrant Management System Release Request Form",
  code: "CJP 34",
  pdfPath: pdf,
  jurisdiction: "MA",
  fields: (data: {
    county?: string;
    oldFirstName?: string;
    oldMiddleName?: string;
    oldLastName?: string;
    dateOfBirth?: string;
    mothersMaidenName?: string;
    otherNamesOrAliases?: string;
  }) => ({
    county: data.county,
    isChangeOfNameProceeding: true, // Constant
    oldName: joinNames(data.oldFirstName, data.oldMiddleName, data.oldLastName),
    dateOfBirth: data.dateOfBirth,
    mothersMaidenName: data.mothersMaidenName,
    otherNamesOrAliases: data.otherNamesOrAliases,
  }),
});
