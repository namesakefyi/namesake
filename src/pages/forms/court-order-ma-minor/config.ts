import type { FormConfig } from "@/constants/forms";
import { deriveCurrentAge } from "@/utils/deriveCurrentAge";
import { addressStep } from "./_steps/AddressStep";
import { birthCertificateParentsStep } from "./_steps/BirthCerticiateParentsStep";
import { birthplaceStep } from "./_steps/BirthplaceStep";
import { coGuardianStep } from "./_steps/CoGuardianStep";
import { consentStep } from "./_steps/ConsentStep";
import { currentNameStep } from "./_steps/CurrentNameStep";
import { dateOfBirthStep } from "./_steps/DateOfBirthStep";
import { feeWaiverStep } from "./_steps/FeeWaiverStep";
import { guardianStep } from "./_steps/GuardianStep";
import { interpreterStep } from "./_steps/InterpreterStep";
import { newNameStep } from "./_steps/NewNameStep";
import { parentAddressStep } from "./_steps/ParentAddressStep";
import { parentalRightsTerminatedStep } from "./_steps/ParentalRightsTerminatedStep";
import { parentInfoStep } from "./_steps/ParentInfoStep";
import { parentsDeceasedStep } from "./_steps/ParentsDeceasedStep";
import { presentedByStep } from "./_steps/PresentedByStep";
import { previousNameChangeStep } from "./_steps/PreviousNameChangeStep";
import { pronounsStep } from "./_steps/PronounsStep";
import { reasonStep } from "./_steps/ReasonStep";
import { returnDocumentsStep } from "./_steps/ReturnDocumentsStep";
import { youthServicesStep } from "./_steps/YouthServicesStep";

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
    returnDocumentsStep,
    interpreterStep,
    pronounsStep,
    feeWaiverStep,
  ],
  pdfs: [
    { pdfId: "cjp25-petition-to-change-name-of-minor" },
    {
      pdfId: "cjp34-cori-and-wms-release-request",
      when: (data) => (deriveCurrentAge(data.dateOfBirth) ?? 0) >= 12,
    },
    {
      pdfId: "affidavit-of-indigency",
      when: (data) => data.shouldApplyForFeeWaiver === true,
    },
    // TODO: Add CJP 31 and TC0002 PDFs
  ],
  downloadTitle: "Massachusetts Court Order (Minor)",
  instructions: [
    "Review all documents carefully.",
    "Do not sign the Petition to Change Name of Minor (CJP 25) until in the presence of a notary.",
    "File with the Probate and Family Court in your county.",
    {
      text: "Complete the Affidavit of Indigency on your own.",
      when: (data) => data.shouldApplyForFeeWaiver === true,
    },
    {
      text: "To pay for filing, bring a credit or debit card, a check made payable to the Commonwealth of Massachusetts, or exact cash.",
      when: (data) => data.shouldApplyForFeeWaiver !== true,
    },
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
