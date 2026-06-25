import { defineForm } from "#lib/forms/defineForm";
import { addressStep } from "./steps/AddressStep";
import { birthplaceStep } from "./steps/BirthplaceStep";
import { contactInfoStep } from "./steps/ContactInfoStep";
import { currentNameStep } from "./steps/CurrentNameStep";
import { dateOfBirthStep } from "./steps/DateOfBirthStep";
import { interpreterStep } from "./steps/InterpreterStep";
import { mothersMaidenNameStep } from "./steps/MothersMaidenNameStep";
import { newNameStep } from "./steps/NewNameStep";
import { otherNamesStep } from "./steps/OtherNamesStep";
import { previousNameChangeStep } from "./steps/PreviousNameChangeStep";
import { pronounsStep } from "./steps/PronounsStep";
import { reasonStep } from "./steps/ReasonStep";

export default defineForm({
  title: "Court Order: Massachusetts",
  description:
    "If you live in Massachusetts and want to legally update your name, this is the place to start.",
  jurisdiction: "ma",
  category: "court-order",
  costs: [
    { title: "Filing fee", amount: 150, required: "required" },
    { title: "Surcharge fee", amount: 15, required: "required" },
  ],
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
});
