import type { FormConfig } from "../../../constants/forms";
import { addressStep } from "./steps/AddressStep";
import { birthCertificateStep } from "./steps/BirthCertificateStep";
import { birthplaceStep } from "./steps/BirthplaceStep";
import { contactInfoStep } from "./steps/ContactInfoStep";
import { currentNameStep } from "./steps/CurrentNameStep";
import { dateOfBirthStep } from "./steps/DateOfBirthStep";
import { familyInfoStep } from "./steps/FamilyInfoStep";
import { newNameStep } from "./steps/NewNameStep";
import { personalInfoStep } from "./steps/PersonalInfoStep";
import { previousAddressesStep } from "./steps/PreviousAddressesStep";
import { previousNameChangeStep } from "./steps/PreviousNameChangeStep";
import { reasonStep } from "./steps/ReasonStep";

export const courtOrderRiConfig: FormConfig = {
  title: "Court Order: Rhode Island",
  description:
    "If you live in Rhode Island and want to legally update your name, this is the place to start.",
  state: "ri",
  category: "court-order",
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
