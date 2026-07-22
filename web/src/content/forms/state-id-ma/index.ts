import { defineForm } from "#lib/forms/defineForm";
import { addressStep } from "./steps/AddressStep";
import { citizenshipStep } from "./steps/CitizenshipStep";
import { contactInfoStep } from "./steps/ContactInfoStep";
import { credentialHistoryStep } from "./steps/CredentialHistoryStep";
import { credentialStep } from "./steps/CredentialStep";
import { currentCredentialStep } from "./steps/CurrentCredentialStep";
import { dateOfBirthStep } from "./steps/DateOfBirthStep";
import { demographicsStep } from "./steps/DemographicsStep";
import { drivingSafetyStep } from "./steps/DrivingSafetyStep";
import { emergencyContactStep } from "./steps/EmergencyContactStep";
import { guardianConsentStep } from "./steps/GuardianConsentStep";
import { militaryStep } from "./steps/MilitaryStep";
import { newNameStep } from "./steps/NewNameStep";
import { otherChangesStep } from "./steps/OtherChangesStep";

export default defineForm({
  title: "State ID: Massachusetts",
  description:
    "Update the name and other information on your Massachusetts driver's license, learner's permit, or ID card.",
  jurisdiction: "ma",
  category: "state-id",
  costs: [
    {
      title: "Driver's license/ID amendment fee",
      amount: 25,
      required: "required",
    },
  ],
  steps: [
    credentialStep,
    newNameStep,
    currentCredentialStep,
    dateOfBirthStep,
    otherChangesStep,
    addressStep,
    contactInfoStep,
    emergencyContactStep,
    demographicsStep,
    militaryStep,
    citizenshipStep,
    credentialHistoryStep,
    drivingSafetyStep,
    guardianConsentStep,
  ],
  pdfs: [{ pdfId: "lic100-drivers-license-learners-permit-or-id-card" }],
  downloadTitle: "Massachusetts State ID Application",
  completionMessage:
    "Remember to print, sign, and date your application. The application is not complete without your signature.",
  instructions: [
    "Review the application carefully and complete any fields Namesake left blank.",
    "Enter your Social Security number in section B7. For your privacy, Namesake never asks for it.",
    "If you do not have a Social Security number, complete section B8 and bring the required supporting documents.",
    "Sign and date the application after printing it.",
    {
      text: "The person giving consent must sign section H4. If they are not a parent, they must also provide proof of their authority.",
      when: (data) => guardianConsentStep.when?.(data) === true,
    },
    {
      text: "Because you selected REAL ID, bring an acceptable document proving your legal name change if your new name does not match your lawful-presence documents.",
      when: (data) => data.stateIdType === "realId",
    },
    "Bring the application, your current credential, your updated Social Security card, and all required identity and residency documents to your RMV appointment.",
  ],
});
