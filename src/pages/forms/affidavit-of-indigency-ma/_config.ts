import type { FormConfig } from "../../../constants/forms";
import { extraFeesStep } from "./_steps/ExtraFeesStep";
import { indigencyBasisStep } from "./_steps/IndigencyBasisStep";
import { incomePovertyStep } from "./_steps/IncomePovertyStep";
import { normalFeesStep } from "./_steps/NormalFeesStep";
import { publicAssistanceStep } from "./_steps/PublicAssistanceStep";

export const affidavitOfIndigencyMaConfig: FormConfig = {
  slug: "affidavit-of-indigency-ma",
  steps: [
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
