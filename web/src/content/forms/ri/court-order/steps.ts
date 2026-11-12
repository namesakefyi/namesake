import { NameChangeReasonBanner } from "#components/forms/NameChangeReasonBanner";
import { defineSteps } from "#lib/forms/defineForm";
import type { Condition } from "#lib/forms/questions";
import { q } from "#lib/forms/questions";

const isHoused: Condition = (data) => data.isCurrentlyUnhoused !== true;

export default defineSteps([
  {
    id: "new-name",
    title: "What is your new name?",
    description:
      "This is the name you're making official! Type it exactly as you want it to appear.",
    questions: [q.name("newName")],
  },
  {
    id: "current-name",
    title: "What is your current legal name?",
    description:
      "This is the name you're leaving behind. Type it exactly as it appears on your ID.",
    questions: [q.name("oldName")],
  },
  {
    id: "reason",
    title: "What is the reason you're changing your name?",
    questions: [
      q.longText("reasonForChangingName", {
        label: "Reason for name change",
      }),
      q.display(NameChangeReasonBanner),
    ],
  },
  {
    id: "contact-info",
    title: "What is your contact information?",
    description:
      "The court uses this to communicate with you about your filing status.",
    questions: [
      q.phone("phoneNumber"),
      q.email("email", { reviewLabel: "Email" }),
    ],
  },
  {
    id: "address",
    title: "What is your residential address?",
    description:
      "You must file your name change with the Probate Court in the city or town where you live.",
    questions: [
      q.checkbox("isCurrentlyUnhoused", {
        label: "I am currently unhoused or without permanent housing",
        reviewLabel: "Currently unhoused?",
      }),
      q.banner(
        "We recommend reaching out to [Thundermist Health Center](https://www.thundermisthealth.org/services/social-services/), which has locations in Woonsocket, West Warwick, and Wakefield. Thundermist can help connect you with social services and may be able to provide an address to use for your name change application.",
        { when: (data) => data.isCurrentlyUnhoused === true },
      ),
      q.address("residence", { when: isHoused }),
      q.checkbox("isMailingAddressDifferentFromResidence", {
        when: isHoused,
        label: "I use a different mailing address",
        reviewLabel: "Mailing address different from residence?",
      }),
      q.subsection([q.address("mailing")], {
        when: (data) =>
          isHoused(data) &&
          data.isMailingAddressDifferentFromResidence === true,
        title: "What is your mailing address?",
      }),
    ],
  },
  {
    id: "previous-addresses",
    title: "What are your most recent addresses?",
    description:
      "List up to three addresses where you have resided prior to your current address.",
    questions: [
      q.repeatingEntry("previousAddresses", {
        reviewLabel: "Previous addresses",
        min: 0,
        max: 3,
        itemLabel: "Address",
        size: 40,
      }),
    ],
  },
  {
    id: "date-of-birth",
    title: "What is your date of birth?",
    questions: [q.memorableDate("dateOfBirth", { label: "Date of birth" })],
  },
  {
    id: "birthplace",
    title: "Where were you born?",
    questions: [
      q.shortText("birthplaceCity", {
        label: "City",
        reviewLabel: "City of birth",
      }),
      q.comboBox("birthplaceCountry", {
        label: "Country",
        reviewLabel: "Country of birth",
        placeholder: "Select a country",
      }),
      q.comboBox("birthplaceState", {
        when: (data) => data.birthplaceCountry === "US",
        label: "State",
        reviewLabel: "State of birth",
        placeholder: "Select a state",
      }),
    ],
  },
  {
    id: "birth-certificate",
    title: "Do you want to update your Rhode Island birth certificate?",
    when: (data) =>
      data.birthplaceCountry === "US" && data.birthplaceState === "RI",
    questions: [
      q.yesNo("shouldChangeBirthCertificate", {
        reviewLabel: "Update birth certificate?",
        yesLabel: "Yes, update my birth certificate to my new name",
        noLabel: "No, don't change my birth certificate",
      }),
    ],
  },
  {
    id: "previous-name-change",
    title: "Have you ever changed your name before?",
    questions: [
      q.yesNo("hasPreviousNameChange", {
        reviewLabel: "Has previous name change?",
        yesLabel: "Yes, I've changed my name before",
        noLabel: "No, I've never changed my name",
      }),
      q.subsection(
        [
          q.shortText("previousNameFrom", {
            label: "Previous legal name",
            description: "The name you had before your last name change.",
          }),
        ],
        { when: (data) => data.hasPreviousNameChange === true },
      ),
      q.banner(
        "Attach a copy of each prior court order or marriage license to your petition.",
        { when: (data) => data.hasPreviousNameChange === true },
      ),
    ],
  },
  {
    id: "family-info",
    title: "What are your parents' names?",
    questions: [
      q.subsection([q.name("mothersName")], {
        title: "Mother's maiden name",
      }),
      q.subsection([q.name("fathersName")], { title: "Father's name" }),
    ],
  },
  {
    id: "personal-info",
    title: "What is your occupation and marital status?",
    questions: [
      q.shortText("occupation", { label: "Occupation" }),
      q.comboBox("maritalStatus", {
        label: "Marital status (optional)",
        reviewLabel: "Marital status",
        placeholder: "Select marital status",
        options: ["Single", "Married", "Divorced", "Widowed"].map((status) => ({
          label: status,
          value: status,
        })),
      }),
    ],
  },
]);
