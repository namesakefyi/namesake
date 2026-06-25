import { defineForm } from "#lib/forms/defineForm";
import { mailingAddressStep } from "./steps/AddressStep";
import { birthGenderStep } from "./steps/BirthGenderStep";
import { birthNameStep } from "./steps/BirthNameStep";
import { birthTownStep } from "./steps/BirthtownStep";
import { contactInfoStep } from "./steps/ContactInfoStep";
import { dateOfBirthStep } from "./steps/DateOfBirthStep";
import { guardianAuthorizationStep } from "./steps/GuardianAuthorizationStep";
import { newGenderStep } from "./steps/NewGenderStep";
import { newNameStep } from "./steps/NewNameStep";
import { parentNamesStep } from "./steps/ParentNamesStep";
import { waiveCostsStep } from "./steps/WaiveCostsStep";

export default defineForm({
  title: "Birth Certificate: Massachusetts",
  description:
    "Use this form to update your legal name and gender marker on your Massachusetts birth certificate.",
  state: "ma",
  category: "birth-certificate",
  steps: [
    birthGenderStep,
    newGenderStep,
    birthNameStep,
    newNameStep,
    dateOfBirthStep,
    birthTownStep,
    parentNamesStep,
    mailingAddressStep,
    contactInfoStep,
    waiveCostsStep,
    guardianAuthorizationStep,
  ],
  pdfs: [
    {
      pdfId:
        "r116-applicant-affidavit-in-support-of-amendment-of-a-birth-certificate-for-sex",
    },
  ],
  downloadTitle: "Massachusetts Birth Certificate Affidavit",
  instructions: [
    "Review all documents carefully.",
    "For a name change, you must first update your name with the Social Security Administration, then you must submit a legal name change order with the application.",
    "Provide a court-certified copy of your legal name change decree, if applicable",
    "Sign and date the required fields.",
  ],
});
