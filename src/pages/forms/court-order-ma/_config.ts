import type { FormConfig } from "../../../constants/forms";
import { addressStep } from "./_steps/AddressStep";
import { birthplaceStep } from "./_steps/BirthplaceStep";
import { contactInfoStep } from "./_steps/ContactInfoStep";
import { currentNameStep } from "./_steps/CurrentNameStep";
import { dateOfBirthStep } from "./_steps/DateOfBirthStep";
import { interpreterStep } from "./_steps/InterpreterStep";
import { mothersMaidenNameStep } from "./_steps/MothersMaidenNameStep";
import { newNameStep } from "./_steps/NewNameStep";
import { otherNamesStep } from "./_steps/OtherNamesStep";
import { previousNameChangeStep } from "./_steps/PreviousNameChangeStep";
import { pronounsStep } from "./_steps/PronounsStep";
import { reasonStep } from "./_steps/ReasonStep";

export const courtOrderMaConfig: FormConfig = {
  slug: "court-order-ma",
  steps: [
    newNameStep,
    currentNameStep,
    reasonStep,
    contactInfoStep,
    birthplaceStep,
    dateOfBirthStep,
    addressStep,
    previousNameChangeStep,
    otherNamesStep,
    interpreterStep,
    pronounsStep,
    mothersMaidenNameStep,
  ],
  pdfs: [
    { pdfId: "cjp27-petition-to-change-name-of-adult" },
    { pdfId: "cjp34-cori-and-wms-release-request" },
  ],
  downloadTitle: "Massachusetts Court Order",
  instructions: [
    "Do not sign the Petition to Change Name (CJP 27) until in the presence of a notary.",
    "Review all documents carefully.",
    "File with the Probate and Family Court in your county.",
    "Remember to bring a certified copy of your birth certificate and certified copies of any previous name changes.",
  ],
};
