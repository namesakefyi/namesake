import { NameChangeReasonBanner } from "#components/forms/NameChangeReasonBanner";
import { defineForm } from "#lib/forms/defineForm";
import { type Condition, node } from "#lib/forms/steps";

const isHoused: Condition = (data) => data.isCurrentlyUnhoused !== true;

export default defineForm({
  steps: [
    {
      id: "new-name",
      title: "What is your new name?",
      description:
        "This is the name you're making official! Type it exactly as you want it to appear.",
      body: [node.name("newName")],
    },
    {
      id: "current-name",
      title: "What is your current legal name?",
      description:
        "This is the name you're leaving behind. Type it exactly as it appears on your ID.",
      body: [node.name("oldName")],
    },
    {
      id: "reason",
      title: "What is the reason you're changing your name?",
      body: [
        node.longText("reasonForChangingName", {
          label: "Reason for name change",
        }),
        node.display(NameChangeReasonBanner),
      ],
    },
    {
      id: "contact-info",
      title: "What is your contact information?",
      description:
        "The court uses this to communicate with you about your filing status.",
      body: [
        node.phone("phoneNumber"),
        node.email("email", { reviewLabel: "Email" }),
      ],
    },
    {
      id: "address",
      title: "What is your residential address?",
      description:
        "You must file your name change with the Probate Court in the city or town where you live.",
      body: [
        node.checkbox("isCurrentlyUnhoused", {
          label: "I am currently unhoused or without permanent housing",
          reviewLabel: "Currently unhoused?",
        }),
        node.banner(
          "We recommend reaching out to [Thundermist Health Center](https://www.thundermisthealth.org/services/social-services/), which has locations in Woonsocket, West Warwick, and Wakefield. Thundermist can help connect you with social services and may be able to provide an address to use for your name change application.",
          { when: (data) => data.isCurrentlyUnhoused === true },
        ),
        node.address("residence", { when: isHoused }),
        node.checkbox("isMailingAddressDifferentFromResidence", {
          label: "I use a different mailing address",
          reviewLabel: "Mailing address different from residence?",
          when: isHoused,
        }),
        node.subsection([node.address("mailing")], {
          title: "What is your mailing address?",
          when: (data) =>
            isHoused(data) &&
            data.isMailingAddressDifferentFromResidence === true,
        }),
      ],
    },
    {
      id: "previous-addresses",
      title: "What are your most recent addresses?",
      description:
        "List up to three addresses where you have resided prior to your current address.",
      body: [
        node.repeatingEntry("previousAddresses", {
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
      body: [node.memorableDate("dateOfBirth", { label: "Date of birth" })],
    },
    {
      id: "birthplace",
      title: "Where were you born?",
      body: [
        node.shortText("birthplaceCity", {
          label: "City",
          reviewLabel: "City of birth",
        }),
        node.comboBox("birthplaceCountry", {
          label: "Country",
          reviewLabel: "Country of birth",
          placeholder: "Select a country",
          source: "countries",
        }),
        node.comboBox("birthplaceState", {
          label: "State",
          reviewLabel: "State of birth",
          placeholder: "Select a state",
          source: "jurisdictions",
          when: (data) => data.birthplaceCountry === "US",
        }),
      ],
    },
    {
      id: "birth-certificate",
      title: "Do you want to update your Rhode Island birth certificate?",
      when: (data) =>
        data.birthplaceCountry === "US" && data.birthplaceState === "RI",
      body: [
        node.yesNo("shouldChangeBirthCertificate", {
          reviewLabel: "Update birth certificate?",
          yesLabel: "Yes, update my birth certificate to my new name",
          noLabel: "No, don't change my birth certificate",
        }),
      ],
    },
    {
      id: "previous-name-change",
      title: "Have you ever changed your name before?",
      body: [
        node.yesNo("hasPreviousNameChange", {
          reviewLabel: "Has previous name change?",
          yesLabel: "Yes, I've changed my name before",
          noLabel: "No, I've never changed my name",
        }),
        node.banner(
          "Attach a copy of each prior court order or marriage license to your petition.",
          { when: (data) => data.hasPreviousNameChange === true },
        ),
      ],
    },
    {
      id: "family-info",
      title: "What are your parents' names?",
      body: [
        node.subsection([node.name("mothersName")], {
          title: "Mother's maiden name",
        }),
        node.subsection([node.name("fathersName")], {
          title: "Father's name",
        }),
      ],
    },
    {
      id: "personal-info",
      title: "What is your occupation and marital status?",
      body: [
        node.shortText("occupation", { label: "Occupation" }),
        node.comboBox("maritalStatus", {
          label: "Marital status (optional)",
          reviewLabel: "Marital status",
          placeholder: "Select marital status",
          source: "maritalStatus",
        }),
      ],
    },
  ],
  pdfs: [
    { pdfId: "background-check-authorization-of-release" },
    { pdfId: "pc8.1-change-of-name" },
  ],
  downloadTitle: "Rhode Island Court Order",
  instructions: [
    "Do not sign either form until in the presence of a notary.",
    "Review all documents carefully.",
    "File with the Probate Court in the city or town where you live.",
    "Remember to bring a certified copy of your original birth certificate and a BCI (criminal background) report.",
    {
      text: "Attach a copy of each prior court order or marriage license to your petition.",
      when: (data) => data.hasPreviousNameChange === true,
    },
  ],
});
