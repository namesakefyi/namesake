import { NameChangeReasonBanner } from "#components/forms/NameChangeReasonBanner";
import { defineForm } from "#lib/forms/defineForm";
import { allOf, block, field, is, isTrue, not } from "#lib/forms/steps";

const isHoused = not(isTrue("isCurrentlyUnhoused"));

export default defineForm({
  steps: [
    {
      id: "new-name",
      title: "What is your new name?",
      description:
        "This is the name you're making official! Type it exactly as you want it to appear.",
      body: [field.name("newName")],
    },
    {
      id: "current-name",
      title: "What is your current legal name?",
      description:
        "This is the name you're leaving behind. Type it exactly as it appears on your ID.",
      body: [field.name("oldName")],
    },
    {
      id: "reason",
      title: "What is the reason you're changing your name?",
      body: [
        field.longText("reasonForChangingName", {
          label: "Reason for name change",
        }),
        block.display(NameChangeReasonBanner),
      ],
    },
    {
      id: "contact-info",
      title: "What is your contact information?",
      description:
        "The court uses this to communicate with you about your filing status.",
      body: [
        field.phone("phoneNumber"),
        field.email("email", { reviewLabel: "Email" }),
      ],
    },
    {
      id: "address",
      title: "What is your residential address?",
      description:
        "You must file your name change with the Probate Court in the city or town where you live.",
      body: [
        field.checkbox("isCurrentlyUnhoused", {
          label: "I am currently unhoused or without permanent housing",
          reviewLabel: "Currently unhoused?",
        }),
        block.banner(
          "We recommend reaching out to [Thundermist Health Center](https://www.thundermisthealth.org/services/social-services/), which has locations in Woonsocket, West Warwick, and Wakefield. Thundermist can help connect you with social services and may be able to provide an address to use for your name change application.",
          { when: isTrue("isCurrentlyUnhoused") },
        ),
        field.address("residence", { when: isHoused }),
        field.checkbox("isMailingAddressDifferentFromResidence", {
          label: "I use a different mailing address",
          reviewLabel: "Mailing address different from residence?",
          when: isHoused,
        }),
        block.subsection([field.address("mailing")], {
          title: "What is your mailing address?",
          when: allOf(
            isHoused,
            isTrue("isMailingAddressDifferentFromResidence"),
          ),
        }),
      ],
    },
    {
      id: "previous-addresses",
      title: "What are your most recent addresses?",
      description:
        "List up to three addresses where you have resided prior to your current address.",
      body: [
        field.repeatingEntry("previousAddresses", {
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
      body: [field.memorableDate("dateOfBirth", { label: "Date of birth" })],
    },
    {
      id: "birthplace",
      title: "Where were you born?",
      body: [
        field.shortText("birthplaceCity", {
          label: "City",
          reviewLabel: "City of birth",
        }),
        field.comboBox("birthplaceCountry", {
          label: "Country",
          reviewLabel: "Country of birth",
          placeholder: "Select a country",
          source: "countries",
        }),
        field.comboBox("birthplaceState", {
          label: "State",
          reviewLabel: "State of birth",
          placeholder: "Select a state",
          source: "jurisdictions",
          when: is("birthplaceCountry", "US"),
        }),
      ],
    },
    {
      id: "birth-certificate",
      title: "Do you want to update your Rhode Island birth certificate?",
      when: allOf(is("birthplaceCountry", "US"), is("birthplaceState", "RI")),
      body: [
        field.yesNo("shouldChangeBirthCertificate", {
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
        field.yesNo("hasPreviousNameChange", {
          reviewLabel: "Has previous name change?",
          yesLabel: "Yes, I've changed my name before",
          noLabel: "No, I've never changed my name",
        }),
        block.banner(
          "Attach a copy of each prior court order or marriage license to your petition.",
          { when: isTrue("hasPreviousNameChange") },
        ),
      ],
    },
    {
      id: "family-info",
      title: "What are your parents' names?",
      body: [
        block.subsection([field.name("mothersName")], {
          title: "Mother's maiden name",
        }),
        block.subsection([field.name("fathersName")], {
          title: "Father's name",
        }),
      ],
    },
    {
      id: "personal-info",
      title: "What is your occupation and marital status?",
      body: [
        field.shortText("occupation", { label: "Occupation" }),
        field.comboBox("maritalStatus", {
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
      when: isTrue("hasPreviousNameChange"),
    },
  ],
});
