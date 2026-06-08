import type { FormConfig } from "../../../constants/forms";
import { addressStep } from "./steps/AddressStep";
import { currentNameStep } from "./steps/CurrentNameStep";
import { extraFeesStep } from "./steps/ExtraFeesStep";
import { incomePovertyStep } from "./steps/IncomePovertyStep";
import { indigencyBasisStep } from "./steps/IndigencyBasisStep";
import { normalFeesStep } from "./steps/NormalFeesStep";
import { publicAssistanceStep } from "./steps/PublicAssistanceStep";

export const affidavitOfIndigencyMaConfig: FormConfig = {
  slug: "affidavit-of-indigency-ma",
  steps: [
    currentNameStep,
    addressStep,
    indigencyBasisStep,
    publicAssistanceStep,
    incomePovertyStep,
    normalFeesStep,
    extraFeesStep,
  ],
  pdfs: [{ pdfId: "affidavit-of-indigency" }],
  downloadTitle: "Affidavit of Indigency",
  instructions: [
    "Do not sign the Affidavit of Indigency until you are in the presence of a notary.",
    "File with the Probate and Family Court along with your other documents.",
  ],
};
