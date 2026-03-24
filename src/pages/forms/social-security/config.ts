import type { FormConfig } from "@/constants/forms";
import { addressStep } from "./_steps/AddressStep";
import { birthplaceStep } from "./_steps/BirthplaceStep";
import { citizenshipStep } from "./_steps/CitizenshipStep";
import { dateOfBirthStep } from "./_steps/DateOfBirthStep";
import { ethnicityStep } from "./_steps/EthnicityStep";
import { filingForSomeoneElseStep } from "./_steps/FilingForSomeoneElseStep";
import { newNameStep } from "./_steps/NewNameStep";
import { oldNameStep } from "./_steps/OldNameStep";
import { parentOneNameStep } from "./_steps/ParentOneNameStep";
import { parentTwoNameStep } from "./_steps/ParentTwoNameStep";
import { phoneNumberStep } from "./_steps/PhoneNumberStep";
import { previousNamesStep } from "./_steps/PreviousNamesStep";
import { previousSocialSecurityCardStep } from "./_steps/PreviousSocialSecurityCardStep";
import { raceStep } from "./_steps/RaceStep";
import { sexStep } from "./_steps/SexStep";

export const socialSecurityConfig: FormConfig = {
  slug: "social-security",
  steps: [
    newNameStep,
    oldNameStep,
    previousNamesStep,
    birthplaceStep,
    dateOfBirthStep,
    citizenshipStep,
    ethnicityStep,
    raceStep,
    sexStep,
    parentOneNameStep,
    parentTwoNameStep,
    previousSocialSecurityCardStep,
    phoneNumberStep,
    addressStep,
    filingForSomeoneElseStep,
  ],
  pdfs: [{ pdfId: "ss5-application-for-social-security-card" }],
  downloadTitle: "Social Security Card",
  instructions: [
    "Please review all documents carefully.",
    "Fill in your social security number—for security, Namesake never asks for this.",
    "Make an Appointment with a Social Security Administration Office.",
    "Remember to bring certified copies of your completed court order, along with other required supporting documents.",
    {
      text: "You must provide a document from a U.S. Federal, State, or local government agency that explains why you need a Social Security number and that you meet all the requirements for the government benefit.",
      when: (data) =>
        data.citizenshipStatus === "legalAlienNotAllowedToWork" ||
        data.citizenshipStatus === "other",
    },
  ],
};
