import { defineForm } from "#forms/defineForm";
import { addressStep } from "./steps/AddressStep";
import { birthplaceStep } from "./steps/BirthplaceStep";
import { citizenshipStep } from "./steps/CitizenshipStep";
import { dateOfBirthStep } from "./steps/DateOfBirthStep";
import { ethnicityStep } from "./steps/EthnicityStep";
import { filingForSomeoneElseStep } from "./steps/FilingForSomeoneElseStep";
import { newNameStep } from "./steps/NewNameStep";
import { oldNameStep } from "./steps/OldNameStep";
import { parentOneNameStep } from "./steps/ParentOneNameStep";
import { parentTwoNameStep } from "./steps/ParentTwoNameStep";
import { phoneNumberStep } from "./steps/PhoneNumberStep";
import { previousNamesStep } from "./steps/PreviousNamesStep";
import { previousSocialSecurityCardStep } from "./steps/PreviousSocialSecurityCardStep";
import { raceStep } from "./steps/RaceStep";
import { sexStep } from "./steps/SexStep";

export default defineForm({
  title: "Social Security",
  description: "Apply for a new Social Security card with your updated name.",
  category: "social-security",
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
});
