import { definePdf } from "#lib/pdfs/definePdf";
import pdf from "./applicant-affidavit-in-support-of-amendment-of-a-birth-certificate-for-sex.pdf";
import type { PdfFieldName } from "./schema";

export default definePdf<PdfFieldName>({
  id: "applicant-affidavit-in-support-of-amendment-of-a-birth-certificate-for-sex",
  title:
    "Applicant Affidavit in Support of Amendment of a Birth Certificate for Sex",
  jurisdiction: "MA",
  code: "R-116",
  canonicalUrl:
    "https://www.mass.gov/doc/applicant-affidavit-for-amending-sex-on-a-birth-certificate-2/download",
  pdfPath: pdf,
  resolver: (data) => ({
    // TODO: Map fields to form data
    "Name First Middle Last": undefined,
    "Sex Listed": undefined,
    "Date of Birth": undefined,
    "CityTown of Birth": undefined,
    "Parent 1 Name": undefined,
    "Parent 2 Name": undefined,
    "Name First Middle Last to appear": undefined,
    "Sex to appear": undefined,
    "Mailing Address": undefined,
    "Applicants contact information": undefined,
    "Telephone optional": undefined,
    Email: undefined,
    "A courtcertified copy of a legal name change decree if applicable and":
      undefined,
    "A check or money order payable to the Commonwealth of Massachusetts as follows":
      undefined,
    "Name of Parent/Guardian1": undefined,
    "Name of Parent/Guardian2": undefined,
    "Signature of ParentGuardian 1 X": undefined,
    "ParentGuardian1 SignatureDate": undefined,
    "ParentGuardian2 SignatureX": undefined,
    "ParentGuardian2 SignatureDate": undefined,
    "Signature of Subject": undefined,
    SubjectSignatureDate: undefined,
  }),
});
