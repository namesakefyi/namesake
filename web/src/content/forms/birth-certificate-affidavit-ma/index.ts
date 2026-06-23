import { defineForm } from "#lib/forms/defineForm";
import { mailingAddressStep } from "./steps/AddressStep";
import { birthTownStep } from "./steps/BirthtownStep";
import { contactInfoStep } from "./steps/ContactInfoStep";
import { currentGenderStep } from "./steps/CurrentGenderStep";
import { currentNameStep } from "./steps/CurrentNameStep";
import { dateOfBirthStep } from "./steps/DateOfBirthStep";
import { guardianAuthorizationStep } from "./steps/GuardianAuthorizationStep";
import { newGenderStep } from "./steps/NewGenderStep";
import { newNameStep } from "./steps/NewNameStep";
import { parentNamesStep } from "./steps/ParentNamesStep";
import { supportingDocumentsStep } from "./steps/SupportingDocumentsSteps";

export default defineForm({
  title: "Birth certificate update: Massachusetts",
  description:
    "If you live in Massachusetts and want to update your name or gender, this is the place to start.",
  state: "ma",
  category: "birth-certificate",
  steps: [
    // Section: Information on existing birth certificate
    currentNameStep,
    currentGenderStep,
    dateOfBirthStep,
    birthTownStep,
    parentNamesStep,
    // Section: Name and Sex to appear on amended birth certificate
    newNameStep,
    newGenderStep,
    mailingAddressStep,
    contactInfoStep,
    // Section: Applicant affidavit
    supportingDocumentsStep,
    // Section: For subjects under 18 years of age
    guardianAuthorizationStep,
  ],
  pdfs: [
    {
      pdfId:
        "r116-applicant-affidavit-in-support-of-amendment-of-a-birth-certificate-for-sex",
    },
  ],
  downloadTitle: "Massachusetts birth certificate affidavit",
  instructions: [
    "Review all documents carefully.",
    "For a name change, you must first update your name with the Social Security Administration, then you must submit a legal name change order with the application.",
    "Provide a court-certified copy of your legal name change decree, if applicable",
    "Sign and date the required fields!",
  ],
});
