/** Auto-generated from military-affidavit.pdf — do not edit */
import { PDFCheckBox, PDFRadioGroup, PDFTextField } from "@cantoo/pdf-lib";

export const pdfSchema = {
  "DOCKET NUMBER": PDFTextField,
  "Plaintiff(s)": PDFTextField,
  "Defendant(s)": PDFTextField,
  "Insert Your Name": PDFTextField,
  "A 1": PDFTextField,
  "A 2": PDFTextField,
  "A 3": PDFTextField,
  "B 1": PDFTextField,
  "B 2": PDFTextField,
  "B 3": PDFTextField,
  "Relief Act  Also indicate the exact date that the partyies hashave concluded military service 1":
    PDFTextField,
  "Relief Act  Also indicate the exact date that the partyies hashave concluded military service 2":
    PDFTextField,
  "Relief Act  Also indicate the exact date that the partyies hashave concluded military service 3":
    PDFTextField,
  "court before entering a judgment may require that I file a bond 1":
    PDFTextField,
  "court before entering a judgment may require that I file a bond 2":
    PDFTextField,
  "court before entering a judgment may require that I file a bond 3":
    PDFTextField,
  Group1: PDFRadioGroup,
  "1A": PDFCheckBox,
  "1B": PDFCheckBox,
  "1C": PDFCheckBox,
  "1D": PDFCheckBox,
  "Court Division or County": PDFTextField,
  "Additional Facts": PDFTextField,
  AF2: PDFTextField,
  AF3: PDFTextField,
  "Name, Address, Phone, E-Mail": PDFTextField,
  Date_af_date: PDFTextField,
  "BBO Number": PDFTextField,
  "2B": PDFCheckBox,
  "2AA": PDFCheckBox,
  "2A": PDFCheckBox,
  Signature: PDFTextField,
  Facts: PDFTextField,
  Date3_af_date: PDFTextField,
} as const;

export type PdfFieldName = keyof typeof pdfSchema;
