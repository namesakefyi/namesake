import type { FormConfig } from "../../../constants/forms";
import { deriveCurrentAge } from "../../../utils/deriveCurrentAge";
import { addressStep } from "./steps/AddressStep";
import { birthCertificateParentsStep } from "./steps/BirthCerticiateParentsStep";
import { birthplaceStep } from "./steps/BirthplaceStep";
import { coGuardianStep } from "./steps/CoGuardianStep";
import { consentStep } from "./steps/ConsentStep";
import { currentNameStep } from "./steps/CurrentNameStep";
import { dateOfBirthStep } from "./steps/DateOfBirthStep";
import { guardianStep } from "./steps/GuardianStep";
import { interpreterStep } from "./steps/InterpreterStep";
import { newNameStep } from "./steps/NewNameStep";
import { parentAddressStep } from "./steps/ParentAddressStep";
import { parentalRightsTerminatedStep } from "./steps/ParentalRightsTerminatedStep";
import { parentInfoStep } from "./steps/ParentInfoStep";
import { parentsDeceasedStep } from "./steps/ParentsDeceasedStep";
import { presentedByStep } from "./steps/PresentedByStep";
import { previousNameChangeStep } from "./steps/PreviousNameChangeStep";
import { pronounsStep } from "./steps/PronounsStep";
import { reasonStep } from "./steps/ReasonStep";
import { youthServicesStep } from "./steps/YouthServicesStep";

export const courtOrderMinorMaConfig: FormConfig = {
  slug: "court-order-ma-minor",
  steps: [
    newNameStep,
    currentNameStep,
    reasonStep,
    presentedByStep,
    dateOfBirthStep,
    birthplaceStep,
    addressStep,
    parentInfoStep,
    parentAddressStep,
    birthCertificateParentsStep,
    parentsDeceasedStep,
    parentalRightsTerminatedStep,
    guardianStep,
    coGuardianStep,
    consentStep,
    previousNameChangeStep,
    youthServicesStep,
    interpreterStep,
    pronounsStep,
  ],
  pdfs: [
    { pdfId: "cjp25-petition-to-change-name-of-minor" },
    {
      pdfId: "cjp34-cori-and-wms-release-request",
      when: (data) => (deriveCurrentAge(data.dateOfBirth) ?? 0) >= 12,
    },
    // TODO: Add CJP 31 and TC0002 PDFs
  ],
  downloadTitle: "Massachusetts Court Order (Minor)",
  instructions: [
    "Review all documents carefully.",
    "Do not sign the Petition to Change Name of Minor (CJP 25) until in the presence of a notary.",
    "File with the Probate and Family Court in your county.",
    {
      text: "Since the address or whereabouts of legal parent(s) is unknown, you must file a Motion for Service by Alternate Means and Affidavit of Diligent Search (CJP 31) with a Military Affidavit (TC0002).",
      when: (data) => data.parentsHaveUnknownAddresses === true,
    },
    {
      text: "Attach a copy of the parental death certificate.",
      when: (data) => data.isALegalParentDeceased === true,
    },
    {
      text: "Attach court proof of parental termination of rights.",
      when: (data) => data.hasLegalParentHadParentalRightsTerminated === true,
    },
    "Remember to bring all supporting documents to the court.",
  ],
};
