import { defineForm } from "#lib/forms/defineForm";
import { requestsNameChange } from "./conditions";
import { addressStep } from "./steps/AddressStep";
import { birthplaceStep } from "./steps/BirthplaceStep";
import { convictionsStep } from "./steps/ConvictionsStep";
import { courtCasesStep } from "./steps/CourtCasesStep";
import { courtStep } from "./steps/CourtStep";
import { currentNameStep } from "./steps/CurrentNameStep";
import { dateOfBirthStep } from "./steps/DateOfBirthStep";
import { familyStep } from "./steps/FamilyStep";
import { nameReasonStep } from "./steps/NameReasonStep";
import { newNameStep } from "./steps/NewNameStep";
import { previousNamePetitionStep } from "./steps/PreviousNamePetitionStep";
import { requestTypeStep } from "./steps/RequestTypeStep";
import { sealRecordStep } from "./steps/SealRecordStep";
import { sexDesignationStep } from "./steps/SexDesignationStep";
import { supportingDocumentsStep } from "./steps/SupportingDocumentsStep";
import { supportPaymentsStep } from "./steps/SupportPaymentsStep";

export default defineForm({
  steps: [
    requestTypeStep,
    currentNameStep,
    { ...newNameStep, when: requestsNameChange },
    dateOfBirthStep,
    addressStep,
    courtStep,
    birthplaceStep,
    convictionsStep,
    courtCasesStep,
    familyStep,
    supportPaymentsStep,
    previousNamePetitionStep,
    nameReasonStep,
    sexDesignationStep,
    sealRecordStep,
    supportingDocumentsStep,
  ],
  pdfs: [
    {
      pdfId:
        "ucsnc1-name-change-and-or-sex-designation-change-petition-for-individual-adult",
    },
  ],
  downloadTitle: "New York Court Order",
  instructions: [
    "Sign and date the petition in both places on the last page. You don’t need a notary.",
    "File your petition with the court clerk in the county where you live.",
  ],
});
