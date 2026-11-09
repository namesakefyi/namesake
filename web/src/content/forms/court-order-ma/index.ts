import { NameChangeReasonBanner } from "#components/forms/NameChangeReasonBanner";
import { defineForm } from "#lib/forms/defineForm";
import { allOf, block, field, is, isNotTrue, isTrue } from "#lib/forms/steps";

const isHoused = isNotTrue("isCurrentlyUnhoused");

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
        field.checkbox("hasNoRecordOfOtherStateConvictionsProbationParole", {
          label:
            "I certify that I have no record of convictions, probation, or parole in any other state.",
          reviewLabel:
            "No record of convictions, probation, or parole in any other state?",
        }),
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
      id: "date-of-birth",
      title: "What is your date of birth?",
      body: [field.memorableDate("dateOfBirth", { label: "Date of birth" })],
    },
    {
      id: "address",
      title: "What is your residential address?",
      description:
        "You must file your name change in the county where you live. We'll help you find where to file.",
      body: [
        field.checkbox("isCurrentlyUnhoused", {
          label: "I am currently unhoused or without permanent housing",
          reviewLabel: "Currently unhoused?",
        }),
        block.banner(
          "We recommend reaching out to the [Massachusetts Transgender Political Coalition](https://www.masstpc.org/homelessness/). MTPC can provide an address to use for your name change application and connect you with housing resources.",
          { when: isTrue("isCurrentlyUnhoused") },
        ),
        field.address("residence", {
          address2: true,
          county: true,
          when: isHoused,
        }),
        field.checkbox("isMailingAddressDifferentFromResidence", {
          label: "I use a different mailing address",
          reviewLabel: "Mailing address different from residence?",
          when: isHoused,
        }),
        block.subsection([field.address("mailing", { address2: true })], {
          title: "What is your mailing address?",
          when: allOf([
            isHoused,
            isTrue("isMailingAddressDifferentFromResidence"),
          ]),
        }),
      ],
    },
    {
      id: "previous-name-change",
      title: "Have you ever changed your name before?",
      body: [
        field.yesNo("hasPreviousNameChange", {
          reviewLabel: "Has previous name change?",
          yesLabel: "Yes, I've changed my name",
          noLabel: "No, I've never changed my name",
        }),
        block.subsection(
          [
            field.shortText("previousNameFrom", {
              label: "From",
              reviewLabel: "Previous name from",
            }),
            field.shortText("previousNameTo", {
              label: "To",
              reviewLabel: "Previous name to",
            }),
            field.longText("previousNameReason", {
              label: "Reason for change",
              reviewLabel: "Previous name reason",
            }),
          ],
          {
            title: "Please list your past legal name.",
            when: isTrue("hasPreviousNameChange"),
          },
        ),
      ],
    },
    {
      id: "other-names",
      title: "Have you ever used any other name or alias?",
      description:
        "This includes any names that you have used over a long period of time but did not change legally.",
      body: [
        field.yesNo("hasUsedOtherNameOrAlias", {
          reviewLabel: "Has used other name or alias?",
          yesLabel: "Yes, I've used other names",
          noLabel: "No, there are no other major names I've used",
        }),
        block.banner(
          "This does not include nicknames or other names you've used for short periods of time.",
        ),
        block.subsection(
          [
            field.longText("otherNamesOrAliases", {
              label: "Other names or aliases",
            }),
          ],
          {
            title: "Please list all names you haven't previously listed.",
            when: isTrue("hasUsedOtherNameOrAlias"),
          },
        ),
      ],
    },
    {
      id: "interpreter",
      title:
        "If there is a hearing for your name change, do you need an interpreter?",
      description: "In most cases, a hearing is not required.",
      body: [
        field.yesNo("isInterpreterNeeded", {
          reviewLabel: "Interpreter needed?",
          yesLabel: "Yes, I need an interpreter",
          noLabel: "No, I don't need an interpreter",
        }),
        block.subsection([field.languageSelect("language")], {
          when: isTrue("isInterpreterNeeded"),
        }),
      ],
    },
    {
      id: "pronouns",
      title: "Do you want to share your pronouns with the court staff?",
      body: [
        field.yesNo("isOkayToSharePronouns", {
          reviewLabel: "Okay to share pronouns?",
        }),
        block.subsection([field.pronounSelect()], {
          when: isTrue("isOkayToSharePronouns"),
        }),
      ],
    },
    {
      id: "mothers-maiden-name",
      title: "What is your mother's maiden name?",
      description:
        "The court requests this information in order to look up past court records and verify your identity.",
      body: [
        field.shortText("mothersMaidenName", {
          label: "Mother's maiden name",
        }),
        block.banner(
          "The maiden name is the last name (or family name) of your mother (or guardian) before marriage.",
        ),
      ],
    },
  ],
  pdfs: [
    { pdfId: "cjp27-petition-to-change-name-of-adult" },
    { pdfId: "cjp34-cori-and-wms-release-request" },
  ],
  downloadTitle: "Massachusetts Court Order",
  instructions: [
    "Do not sign the Petition to Change Name (CJP 27) until in the presence of a notary.",
    "Review all documents carefully.",
    "File with the Probate and Family Court in your county.",
    "Remember to bring a certified copy of your birth certificate and certified copies of any previous name changes.",
  ],
});
