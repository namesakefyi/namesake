import { NameChangeReasonBanner } from "#components/forms/NameChangeReasonBanner";
import cjp27 from "#content/pdfs/ma/cjp27-petition-to-change-name-of-adult";
import cjp34, {
  fillCjp34,
} from "#content/pdfs/ma/cjp34-cori-and-wms-release-request";
import { defineForm } from "#lib/forms/defineForm";
import type { Condition } from "#lib/forms/questions";
import { q } from "#lib/forms/questions";
import { formatDateMMDDYYYY } from "#lib/utils/formatDateMMDDYYYY";
import { formatLanguage } from "#lib/utils/formatLanguage";
import { joinPronouns } from "#lib/utils/joinPronouns";

const isHoused: Condition = (data) => data.isCurrentlyUnhoused !== true;

export default defineForm({
  title: "Court Order: Massachusetts",
  description:
    "If you live in Massachusetts and want to legally update your name, this is the place to start.",
  category: "court-order",
  costs: [
    { title: "Filing fee", amount: 150, required: true },
    { title: "Surcharge fee", amount: 15, required: true },
  ],
  steps: [
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
        q.checkbox("hasNoRecordOfOtherStateConvictionsProbationParole", {
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
      questions: [
        q.phone("phoneNumber"),
        q.email("email", { reviewLabel: "Email" }),
      ],
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
      id: "date-of-birth",
      title: "What is your date of birth?",
      questions: [q.memorableDate("dateOfBirth", { label: "Date of birth" })],
    },
    {
      id: "address",
      title: "What is your residential address?",
      description:
        "You must file your name change in the county where you live. We'll help you find where to file.",
      questions: [
        q.checkbox("isCurrentlyUnhoused", {
          label: "I am currently unhoused or without permanent housing",
          reviewLabel: "Currently unhoused?",
        }),
        q.banner(
          "We recommend reaching out to the [Massachusetts Transgender Political Coalition](https://www.masstpc.org/homelessness/). MTPC can provide an address to use for your name change application and connect you with housing resources.",
          { when: (data) => data.isCurrentlyUnhoused === true },
        ),
        q.address("residence", {
          when: isHoused,
          address2: true,
          county: true,
        }),
        q.checkbox("isMailingAddressDifferentFromResidence", {
          when: isHoused,
          label: "I use a different mailing address",
          reviewLabel: "Mailing address different from residence?",
        }),
        q.subsection([q.address("mailing", { address2: true })], {
          when: (data) =>
            isHoused(data) &&
            data.isMailingAddressDifferentFromResidence === true,
          title: "What is your mailing address?",
        }),
      ],
    },
    {
      id: "previous-name-change",
      title: "Have you ever changed your name before?",
      questions: [
        q.yesNo("hasPreviousNameChange", {
          reviewLabel: "Has previous name change?",
          yesLabel: "Yes, I've changed my name",
          noLabel: "No, I've never changed my name",
        }),
        q.subsection(
          [
            q.shortText("previousNameFrom", {
              label: "From",
              reviewLabel: "Previous name from",
            }),
            q.shortText("previousNameTo", {
              label: "To",
              reviewLabel: "Previous name to",
            }),
            q.longText("previousNameReason", {
              label: "Reason for change",
              reviewLabel: "Previous name reason",
            }),
          ],
          {
            when: (data) => data.hasPreviousNameChange === true,
            title: "Please list your past legal name.",
          },
        ),
      ],
    },
    {
      id: "other-names",
      title: "Have you ever used any other name or alias?",
      description:
        "This includes any names that you have used over a long period of time but did not change legally.",
      questions: [
        q.yesNo("hasUsedOtherNameOrAlias", {
          reviewLabel: "Has used other name or alias?",
          yesLabel: "Yes, I've used other names",
          noLabel: "No, there are no other major names I've used",
        }),
        q.banner(
          "This does not include nicknames or other names you've used for short periods of time.",
        ),
        q.subsection(
          [
            q.longText("otherNamesOrAliases", {
              label: "Other names or aliases",
            }),
          ],
          {
            when: (data) => data.hasUsedOtherNameOrAlias === true,
            title: "Please list all names you haven't previously listed.",
          },
        ),
      ],
    },
    {
      id: "interpreter",
      title:
        "If there is a hearing for your name change, do you need an interpreter?",
      description: "In most cases, a hearing is not required.",
      questions: [
        q.yesNo("isInterpreterNeeded", {
          reviewLabel: "Interpreter needed?",
          yesLabel: "Yes, I need an interpreter",
          noLabel: "No, I don't need an interpreter",
        }),
        q.subsection([q.languageSelect("language")], {
          when: (data) => data.isInterpreterNeeded === true,
        }),
      ],
    },
    {
      id: "pronouns",
      title: "Do you want to share your pronouns with the court staff?",
      questions: [
        q.yesNo("isOkayToSharePronouns", {
          reviewLabel: "Okay to share pronouns?",
        }),
        q.subsection([q.pronounSelect()], {
          when: (data) => data.isOkayToSharePronouns === true,
        }),
      ],
    },
    {
      id: "mothers-maiden-name",
      title: "What is your mother's maiden name?",
      description:
        "The court requests this information in order to look up past court records and verify your identity.",
      questions: [
        q.shortText("mothersLastName", { label: "Mother's maiden name" }),
        q.banner(
          "The maiden name is the last name (or family name) of your mother (or guardian) before marriage.",
        ),
      ],
    },
  ],
  download: {
    title: "Massachusetts Court Order",
    instructions: [
      "Do not sign the Petition to Change Name (CJP 27) until in the presence of a notary.",
      "Review all documents carefully.",
      "File with the Probate and Family Court in your county.",
      "Remember to bring a certified copy of your birth certificate and certified copies of any previous name changes.",
    ],
    pdfs: [
      {
        pdf: cjp27,
        fill: (data) => ({
          petitionerFirstName: data.oldFirstName,
          petitionerMiddleName: data.oldMiddleName,
          petitionerLastName: data.oldLastName,
          county: data.residenceCounty,
          oldFirstName: data.oldFirstName,
          oldMiddleName: data.oldMiddleName,
          oldLastName: data.oldLastName,
          birthplaceCity: data.birthplaceCity,
          birthplaceState: data.birthplaceState,
          dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
          residenceStreetAddress: data.residenceStreetAddress,
          residenceSteetAddress2: data.residenceStreetAddress2,
          residenceCity: data.residenceCity,
          residenceState: data.residenceState,
          residenceZipCode: data.residenceZipCode,
          mailingStreetAddress: data.mailingStreetAddress,
          mailingStreetAddress2: data.mailingStreetAddress2,
          mailingCity: data.mailingCity,
          mailingState: data.mailingState,
          mailingZipCode: data.mailingZipCode,
          email: data.email,
          phoneNumber: data.phoneNumber,
          hasPreviousNameChangeTrue: data.hasPreviousNameChange,
          hasPreviousNameChangeFalse: data.hasPreviousNameChange === false,
          previousNameFrom: data.previousNameFrom,
          previousNameTo: data.previousNameTo,
          previousNameReason: data.previousNameReason,
          shouldReturnOriginalDocuments: true,
          hasUsedOtherNameOrAliasTrue: data.hasUsedOtherNameOrAlias,
          hasUsedOtherNameOrAliasFalse: data.hasUsedOtherNameOrAlias === false,
          otherNamesOrAliases: data.otherNamesOrAliases,
          newFirstName: data.newFirstName,
          newMiddleName: data.newMiddleName,
          newLastName: data.newLastName,
          reasonForChangingName: data.reasonForChangingName,
          hasNoRecordOfOtherStateConvictionsProbationParole:
            data.hasNoRecordOfOtherStateConvictionsProbationParole,
          isInterpreterNeeded: data.isInterpreterNeeded,
          language: formatLanguage(data.language),
          isOkayToSharePronouns: data.isOkayToSharePronouns,
          pronouns: joinPronouns(data.pronouns, data.otherPronouns),
        }),
      },
      { pdf: cjp34, fill: fillCjp34 },
    ],
  },
});
