import { defineForm } from "#lib/forms/defineForm";
import { requestsNameChange } from "./conditions";
import { addressStep } from "./steps/AddressStep";
import { birthplaceStep } from "./steps/BirthplaceStep";
import { childSupportStep } from "./steps/ChildSupportStep";
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
import { spousalSupportStep } from "./steps/SpousalSupportStep";
import { supportingDocumentsStep } from "./steps/SupportingDocumentsStep";

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
    childSupportStep,
    spousalSupportStep,
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
  instructions: [],
});
