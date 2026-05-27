/** Auto-generated from military-affidavit.pdf — do not edit */
import { PDFCheckBox, PDFRadioGroup, PDFTextField } from "@cantoo/pdf-lib";

export const pdfSchema = {
  "DOCKET NUMBER": PDFTextField,
  "Plaintiff(s)": PDFTextField,
  Group1: PDFRadioGroup,
  "Defendant(s)": PDFTextField,
  "Court Division or County": PDFTextField,
  "Insert Your Name": PDFTextField,
  Date3_af_date: PDFTextField,
  "1A": PDFCheckBox,
  "A 1": PDFTextField,
  "A 2": PDFTextField,
  "A 3": PDFTextField,
  "1B": PDFCheckBox,
  "B 1": PDFTextField,
  "B 2": PDFTextField,
  "B 3": PDFTextField,
  "1C": PDFCheckBox,
  "Relief Act  Also indicate the exact date that the partyies hashave concluded military service 1":
    PDFTextField,
  "Relief Act  Also indicate the exact date that the partyies hashave concluded military service 2":
    PDFTextField,
  "Relief Act  Also indicate the exact date that the partyies hashave concluded military service 3":
    PDFTextField,
  "1D": PDFCheckBox,
  "court before entering a judgment may require that I file a bond 1":
    PDFTextField,
  "court before entering a judgment may require that I file a bond 2":
    PDFTextField,
  "court before entering a judgment may require that I file a bond 3":
    PDFTextField,
  "2A": PDFCheckBox,
  "2AA": PDFCheckBox,
  "Additional Facts": PDFTextField,
  AF2: PDFTextField,
  AF3: PDFTextField,
  "2B": PDFCheckBox,
  Facts: PDFTextField,
  Signature: PDFTextField,
  Date_af_date: PDFTextField,
  "Name, Address, Phone, E-Mail": PDFTextField,
  "BBO Number": PDFTextField,
} as const;

export type PdfFieldName = keyof typeof pdfSchema;
