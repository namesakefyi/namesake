/** Auto-generated from cjp30-assent-to-petition-to-change-name-of-minor.pdf — do not edit */
import { PDFCheckBox, PDFTextField } from "@cantoo/pdf-lib";

export const pdfSchema = {
  "form1[0].BodyPage1[0].S1[0].DocketNo[0]": PDFTextField,
  "form1[0].BodyPage1[0].S1[0].Fn[0]": PDFTextField,
  "form1[0].BodyPage1[0].S1[0].Mn[0]": PDFTextField,
  "form1[0].BodyPage1[0].S1[0].Ln[0]": PDFTextField,
  "form1[0].BodyPage1[0].S1[0].DropDownList1[0]": PDFTextField,
  "form1[0].BodyPage1[0].S2[0].TextField4[0]": PDFTextField,
  "form1[0].BodyPage1[0].S2[0].TextField4[2]": PDFTextField,
  "form1[0].BodyPage1[0].S2[0].TextField4[1]": PDFTextField,
  "form1[0].BodyPage1[0].S2[0].CheckBox1[0]": PDFCheckBox,
  "form1[0].BodyPage1[0].S2[0].CheckBox1[2]": PDFCheckBox,
  "form1[0].BodyPage1[0].S2[0].CheckBox1[1]": PDFCheckBox,
  "form1[0].BodyPage1[0].S3[0].TextField4[0]": PDFTextField,
  "form1[0].BodyPage1[0].S3[0].TextField4[2]": PDFTextField,
  "form1[0].BodyPage1[0].S3[0].TextField4[1]": PDFTextField,
  "form1[0].S10[0].DateTimeField3[0]": PDFTextField,
  "form1[0].S10[0].TextField5[0]": PDFTextField,
  "form1[0].S10[0].TextField4[0]": PDFTextField,
  "form1[0].S10[0].TextField4[1]": PDFTextField,
  "form1[0].S10[0].TextField4[2]": PDFTextField,
  "form1[0].S10[0].TextField4[5]": PDFTextField,
  "form1[0].S10[0].TextField4[3]": PDFTextField,
  "form1[0].S10[0].TextField4[4]": PDFTextField,
} as const;

export type PdfFieldName = keyof typeof pdfSchema;
