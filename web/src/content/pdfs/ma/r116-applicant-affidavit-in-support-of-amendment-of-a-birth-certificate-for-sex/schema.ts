/** Auto-generated from applicant-affidavit-in-support-of-amendment-of-a-birth-certificate-for-sex.pdf — do not edit */

export type Fields = {
  oldFullName: "text";
  oldGender: "radio";
  dateOfBirth: "text";
  birthplaceCity: "text";
  parent1Name: "text";
  parent2Name: "text";
  newFullName: "text";
  newGender: "radio";
  mailingAddress: "text";
  phoneNumber: "text";
  email: "text";
  nameChangeDecreeIncluded: "checkbox";
  paymentIncluded: "checkbox";
  guardianOneFullName: "text";
  guardianTwoFullName: "text";
};

export const pdfExcludedFields = [
  "Applicants contact information",
  "ParentGuardian1 SignatureDate",
  "ParentGuardian2 SignatureDate",
  "ParentGuardian2 SignatureX",
  "Signature of ParentGuardian 1 X",
  "Signature of Subject",
  "SubjectSignatureDate",
] as const;
