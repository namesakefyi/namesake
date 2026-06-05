/** Auto-generated from cjp34-cori-and-wms-release-request.pdf — do not edit */
import { PDFCheckBox, PDFDropdown, PDFTextField } from "@cantoo/pdf-lib";

export const pdfSchema = {
  caseName: PDFTextField,
  county: PDFDropdown,
  isChangeOfNameProceeding: PDFCheckBox,
  oldName: PDFTextField,
  dateOfBirth: PDFTextField,
  ssnFirstThree: PDFTextField,
  ssnMiddleTwo: PDFTextField,
  ssnLastFour: PDFTextField,
  mothersMaidenName: PDFTextField,
  otherNamesOrAliases: PDFTextField,
} as const;

export type PdfFieldName = keyof typeof pdfSchema;

/** Fields present in the PDF but excluded from the schema */
export const pdfExcludedFields = [
  "form1[0].BodyPage1[0].S1[0].DocketNo[0]",
  "form1[0].BodyPage1[0].S2[0].CheckBox1[1]",
  "form1[0].BodyPage1[0].S2[0].CheckBox1[2]",
  "form1[0].BodyPage1[0].S2[0].CheckBox1[3]",
  "form1[0].BodyPage1[0].S2[0].CheckBox1[4]",
  "form1[0].BodyPage1[0].S2[0].casename[0]",
  "form1[0].BodyPage1[0].S5[0].CheckBox1[0]",
  "form1[0].BodyPage1[0].S5[0].CheckBox1[1]",
  "form1[0].BodyPage1[0].S5[0].CheckBox1[2]",
  "form1[0].BodyPage1[0].S5[0].CheckBox1[3]",
  "form1[0].BodyPage1[0].S5[0].CheckBox1[4]",
  "form1[0].BodyPage1[0].S5[0].DateTimeField1[0]",
  "form1[0].BodyPage1[0].S5[0].DateTimeField1[1]",
] as const;
