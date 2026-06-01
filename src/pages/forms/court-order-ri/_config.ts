import type { FormConfig } from "../../../constants/forms";
import { addressStep } from "./_steps/AddressStep";
import { birthCertificateStep } from "./_steps/BirthCertificateStep";
import { birthplaceStep } from "./_steps/BirthplaceStep";
import { contactInfoStep } from "./_steps/ContactInfoStep";
import { currentNameStep } from "./_steps/CurrentNameStep";
import { dateOfBirthStep } from "./_steps/DateOfBirthStep";
import { familyInfoStep } from "./_steps/FamilyInfoStep";
import { newNameStep } from "./_steps/NewNameStep";
import { personalInfoStep } from "./_steps/PersonalInfoStep";
import { previousAddressesStep } from "./_steps/PreviousAddressesStep";
import { previousNameChangeStep } from "./_steps/PreviousNameChangeStep";
import { reasonStep } from "./_steps/ReasonStep";

export const courtOrderRiConfig: FormConfig = {
  slug: "court-order-ri",
  steps: [
    newNameStep,
    currentNameStep,
    reasonStep,
    contactInfoStep,
    addressStep,
    previousAddressesStep,
    dateOfBirthStep,
    birthplaceStep,
    {
      ...birthCertificateStep,
      when: (data) =>
        data.birthplaceCountry === "US" && data.birthplaceState === "RI",
    },
    previousNameChangeStep,
    familyInfoStep,
    personalInfoStep,
  ],
  pdfs: [
    { pdfId: "background-check-authorization-of-release" },
    { pdfId: "pc8.1-change-of-name" },
  ],
  downloadTitle: "Rhode Island Court Order",
  instructions: [
    "Do not sign either form until in the presence of a notary.",
    "Review all documents carefully.",
    "File with the Probate Court in the city or town where you live.",
    "Remember to bring a certified copy of your original birth certificate and a BCI (criminal background) report.",
    {
      text: "Attach a copy of each prior court order or marriage license to your petition.",
      when: (data) => data.hasPreviousNameChange === true,
    },
  ],
};
