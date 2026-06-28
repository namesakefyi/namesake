import type { PdfFieldType } from "#constants/pdf";

/** Auto-generated from cjp30-assent-to-petition-to-change-name-of-minor.pdf — do not edit */

export const pdfSchema = {
  "form1[0].BodyPage1[0].S1[0].DocketNo[0]": "text",
  "form1[0].BodyPage1[0].S1[0].Fn[0]": "text",
  "form1[0].BodyPage1[0].S1[0].Mn[0]": "text",
  "form1[0].BodyPage1[0].S1[0].Ln[0]": "text",
  "form1[0].BodyPage1[0].S1[0].DropDownList1[0]": "text",
  "form1[0].BodyPage1[0].S2[0].TextField4[0]": "text",
  "form1[0].BodyPage1[0].S2[0].TextField4[2]": "text",
  "form1[0].BodyPage1[0].S2[0].TextField4[1]": "text",
  "form1[0].BodyPage1[0].S2[0].CheckBox1[0]": "checkbox",
  "form1[0].BodyPage1[0].S2[0].CheckBox1[2]": "checkbox",
  "form1[0].BodyPage1[0].S2[0].CheckBox1[1]": "checkbox",
  "form1[0].BodyPage1[0].S3[0].TextField4[0]": "text",
  "form1[0].BodyPage1[0].S3[0].TextField4[2]": "text",
  "form1[0].BodyPage1[0].S3[0].TextField4[1]": "text",
  "form1[0].S10[0].DateTimeField3[0]": "text",
  "form1[0].S10[0].TextField5[0]": "text",
  "form1[0].S10[0].TextField4[0]": "text",
  "form1[0].S10[0].TextField4[1]": "text",
  "form1[0].S10[0].TextField4[2]": "text",
  "form1[0].S10[0].TextField4[5]": "text",
  "form1[0].S10[0].TextField4[3]": "text",
  "form1[0].S10[0].TextField4[4]": "text",
} as const satisfies Record<string, PdfFieldType>;

export type PdfFieldName = keyof typeof pdfSchema;
