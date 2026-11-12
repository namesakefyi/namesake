import type { PdfValues } from "#constants/pdf";
import type { FormData } from "#lib/forms/questions";
import { definePdf } from "#lib/pdfs/definePdf";
import { formatDateMMDDYYYY } from "#lib/utils/formatDateMMDDYYYY";
import { fullName } from "#lib/utils/fullName";
import file from "./cjp34-cori-and-wms-release-request.pdf";
import type { Fields } from "./schema";

export default definePdf<Fields>({
  title: "Court Activity Record Request Form",
  code: "CJP-34",
  canonicalUrl:
    "https://www.mass.gov/doc/court-activity-record-information-and-warrant-management-system-release-request-form-cjp-34/download",
  file,
});

/** Reads only shared fields, so any form can use it. */
export const fillCjp34 = (data: FormData): PdfValues<Fields> => ({
  county: data.residenceCounty,
  caseName: fullName(data, "oldName"),
  isChangeOfNameProceeding: true,
  oldName: fullName(data, "oldName"),
  dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
  mothersMaidenName: data.mothersLastName,
  otherNamesOrAliases: data.otherNamesOrAliases,
  ssnFirstThree: undefined,
  ssnMiddleTwo: undefined,
  ssnLastFour: undefined,
});
