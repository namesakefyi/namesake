/** Auto-generated from affidavit-of-indigency.pdf — do not edit */
import { PDFCheckBox, PDFTextField } from "@cantoo/pdf-lib";

export const pdfSchema = {
  courtName: PDFTextField,
  caseNameAndNumber: PDFTextField,
  applicantName: PDFTextField,
  residenceStreetAddress: PDFTextField,
  residenceCity: PDFTextField,
  residenceStateAndZip: PDFTextField,
  isSectionAChecked: PDFCheckBox,
  "Transitional Aid to Families with Dependent Children TAFDC": PDFCheckBox,
  "Medicaid MassHealth": PDFCheckBox,
  "Emergency Aid to Elderly Disabled or Children EAEDC": PDFCheckBox,
  "Supplemental Security Income SSI": PDFCheckBox,
  "Massachusetts Veterans Benefits Programs or": PDFCheckBox,
  "persons consisting of myself and": PDFTextField,
  B: PDFCheckBox,
  week: PDFCheckBox,
  biweekly: PDFCheckBox,
  month: PDFCheckBox,
  year: PDFCheckBox,
  "check the period that applies for a household of": PDFTextField,
  "which income is at or below the court systems poverty level Note The court systems poverty levels for households":
    PDFTextField,
  "List any other available household income for the checked period on this line":
    PDFTextField,
  C: PDFCheckBox,
  "lower cost paid for by the state Check all that apply and in any":
    PDFTextField,
  "guess as to the cost if known": PDFTextField,
  "Filing fee and any surcharge": PDFCheckBox,
  undefined: PDFTextField,
  "Filing fee and any surcharge for appeal": PDFCheckBox,
  undefined_2: PDFTextField,
  "Fees or costs for serving court summons witness subpoenas or other court papers":
    PDFCheckBox,
  undefined_3: PDFTextField,
  "for  specify": PDFTextField,
  "Other fees or costs of": PDFCheckBox,
  undefined_4: PDFTextField,
  "Substitution specify": PDFCheckBox,
  "of expert services for testing examination testimony or other assistance specify":
    PDFTextField,
  Cost: PDFCheckBox,
  "of taking andor transcribing a deposition of specify name of person":
    PDFTextField,
  undefined_5: PDFTextField,
  Cost_2: PDFCheckBox,
  "Cassette copies of tape recording of trial or other proceeding needed to prepare appeal for applicant not":
    PDFCheckBox,
  "Appeal bond": PDFCheckBox,
  "of preparing written transcript of trial or other proceeding": PDFTextField,
  Cost_3: PDFCheckBox,
  undefined_6: PDFTextField,
  "for  specify_2": PDFTextField,
  "Other fees and costs": PDFCheckBox,
  undefined_7: PDFTextField,
  "Substitution specify_2": PDFCheckBox,
  "Date signed": PDFTextField,
  x: PDFTextField,
} as const;

export type PdfFieldName = keyof typeof pdfSchema;
