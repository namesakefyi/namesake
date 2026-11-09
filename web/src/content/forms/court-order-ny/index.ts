import { NameChangeReasonBanner } from "#components/forms/NameChangeReasonBanner";
import { defineForm } from "#lib/forms/defineForm";
import { node } from "#lib/forms/steps";
import {
  livesInNewYorkCity,
  requestsNameChange,
  requestsSexDesignationChange,
} from "./conditions";

const PREVIOUS_PETITION_DESCRIPTION =
  "Include the court, filing date, case number if known, and result.";

export default defineForm({
  steps: [
    {
      id: "request-type",
      title: "What would you like to change?",
      body: [
        node.radioGroup("nyCourtOrderRequest", {
          reviewLabel: "Requested New York court order",
          options: {
            "Name change": "My name",
            "Sex designation change": "My sex designation",
            Both: "Both my name and sex designation",
          },
        }),
      ],
    },
    {
      id: "current-name",
      title: "What is your current legal name?",
      description: (data) =>
        requestsNameChange(data)
          ? "This is the name you're leaving behind. Type it exactly as it appears on your ID."
          : "Type it exactly as it appears on your ID.",
      body: [node.name("oldName")],
    },
    {
      id: "new-name",
      title: "What is your new name?",
      description:
        "This is the name you're making official! Type it exactly as you want it to appear.",
      when: requestsNameChange,
      body: [node.name("newName")],
    },
    {
      id: "date-of-birth",
      title: "What is your date of birth?",
      body: [node.memorableDate("dateOfBirth", { label: "Date of birth" })],
    },
    {
      id: "address",
      title: "What is your current address?",
      body: [node.address("residence", { address2: true, county: true })],
    },
    {
      id: "court",
      title: "Which court would you like to file in?",
      description:
        "Because you live in New York City, you can file your petition in Civil Court or Supreme Court in your borough. We recommend Civil Court, which has a lower filing fee.",
      when: livesInNewYorkCity,
      body: [
        node.radioGroup("courtType", {
          reviewLabel: "Court type",
          options: { Civil: "Civil Court", Supreme: "Supreme Court" },
        }),
      ],
    },
    {
      id: "birthplace",
      title: "Where were you born?",
      when: requestsNameChange,
      body: [
        node.shortText("birthplaceCity", {
          label: "City, town, or village",
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
        node.shortText("birthplaceRegion", {
          label: "Province or region",
          reviewLabel: "Province or region of birth",
          when: (data) =>
            !!data.birthplaceCountry && data.birthplaceCountry !== "US",
        }),
      ],
    },
    {
      id: "convictions",
      title: "Have you ever been convicted of a crime?",
      description:
        "A crime is a misdemeanor or felony. Traffic tickets and violations, like disorderly conduct, aren't crimes.",
      when: requestsNameChange,
      body: [
        node.yesNo("hasBeenConvictedOfCrime", {
          reviewLabel: "Ever convicted of a crime?",
        }),
        node.subsection(
          [
            node.shortText("courtOfConviction", {
              label: "Court where you were convicted",
              reviewLabel: "Court of conviction",
            }),
            node.longText("crime", {
              label: "Crime for which you were convicted",
              reviewLabel: "Crime of conviction",
            }),
          ],
          { when: (data) => data.hasBeenConvictedOfCrime === true },
        ),
      ],
    },
    {
      id: "court-cases",
      title:
        "Do you have any bankruptcy filings, judgments, liens, or court cases?",
      when: requestsNameChange,
      body: [
        node.yesNo("hasFiledForBankruptcy", {
          label: "Have you ever filed for bankruptcy?",
          reviewLabel: "Ever filed for bankruptcy?",
        }),
        node.yesNo("hasJudgmentsOrLiens", {
          label: "Are there any judgments or liens against you?",
          reviewLabel: "Judgments or liens?",
        }),
        node.yesNo("isPartyToLawsuitOrCourtCase", {
          label: "Are you a party in a lawsuit or other court case?",
          reviewLabel: "Party to a lawsuit or court case?",
        }),
        node.subsection(
          [
            node.longText("bankruptcyJudgmentsLiensDetails", {
              label: "Case details",
              reviewLabel:
                "Bankruptcy, judgments, liens, or court case details",
              description:
                "Include the court, filing date, and case number, if known.",
            }),
          ],
          {
            when: (data) =>
              data.hasFiledForBankruptcy === true ||
              data.hasJudgmentsOrLiens === true ||
              data.isPartyToLawsuitOrCourtCase === true,
          },
        ),
      ],
    },
    {
      id: "family",
      title: "What is your family situation?",
      when: requestsNameChange,
      body: [
        node.yesNo("isCurrentlyMarried", {
          label: "Are you currently married?",
          reviewLabel: "Currently married?",
        }),
        node.yesNo("wasPreviouslyMarried", {
          label: "Were you previously married?",
          reviewLabel: "Previously married?",
        }),
        node.yesNo("hasChildrenUnder21", {
          label: "Do you have any children under 21?",
          reviewLabel: "Children under 21?",
        }),
      ],
    },
    {
      id: "support-payments",
      title: "Do you have to pay child or spousal support?",
      when: requestsNameChange,
      body: [
        node.yesNo("paysChildSupport", {
          label: "Do you have to pay child support?",
          reviewLabel: "Required to pay child support?",
        }),
        node.subsection(
          [
            node.yesNo("areChildSupportPaymentsUpToDate", {
              label: "Are your child support payments up to date?",
              reviewLabel: "Child support payments up to date?",
            }),
            node.subsection(
              [
                node.number("childSupportArrearsAmount", {
                  label: "Child support owed",
                  reviewLabel: "Child support amount owed",
                  min: 0,
                  currency: true,
                }),
              ],
              {
                when: (data) => data.areChildSupportPaymentsUpToDate === false,
              },
            ),
            node.shortText("courtIssuingChildSupportOrder", {
              label: "Court that issued the child support order",
              reviewLabel: "Court issuing child support order",
            }),
            node.shortText("supportCollectionsUnit", {
              label: "Child Support Collections Unit",
            }),
          ],
          { when: (data) => data.paysChildSupport === true },
        ),
        node.yesNo("paysSpousalSupport", {
          label: "Do you have to pay spousal support?",
          reviewLabel: "Required to pay spousal support?",
        }),
        node.subsection(
          [
            node.yesNo("areSpousalSupportPaymentsUpToDate", {
              label: "Are your spousal support payments up to date?",
              reviewLabel: "Spousal support payments up to date?",
            }),
            node.subsection(
              [
                node.number("spousalSupportArrearsAmount", {
                  label: "Spousal support owed",
                  reviewLabel: "Spousal support amount owed",
                  min: 0,
                  currency: true,
                }),
              ],
              {
                when: (data) =>
                  data.areSpousalSupportPaymentsUpToDate === false,
              },
            ),
            node.shortText("courtIssuingSpousalSupportOrder", {
              label: "Court that issued the spousal support order",
              reviewLabel: "Court issuing spousal support order",
            }),
          ],
          { when: (data) => data.paysSpousalSupport === true },
        ),
      ],
    },
    {
      id: "previous-name-petition",
      title: "Have you ever filed a name change petition before?",
      when: requestsNameChange,
      body: [
        node.yesNo("hasPreviouslyFiledNameChange", {
          reviewLabel: "Ever filed a name change petition?",
        }),
        node.subsection(
          [
            node.longText("previousNameChangePetitionDetails", {
              label: "Previous petition details",
              reviewLabel: "Previous name change petition details",
              description: PREVIOUS_PETITION_DESCRIPTION,
            }),
          ],
          { when: (data) => data.hasPreviouslyFiledNameChange === true },
        ),
      ],
    },
    {
      id: "name-reason",
      title: "Why are you changing your name?",
      when: requestsNameChange,
      body: [
        node.longText("reasonForChangingName", {
          label: "Reason for name change",
        }),
        node.display(NameChangeReasonBanner),
      ],
    },
    {
      id: "sex-designation",
      title: "What is your new sex designation?",
      when: requestsSexDesignationChange,
      body: [
        node.radioGroup("newGender", {
          reviewLabel: "Desired gender marker",
          options: { Female: "Female", Male: "Male", X: "X" },
        }),
        node.yesNo("hasPreviouslyFiledSexDesignationChange", {
          label:
            "Have you ever filed a sex designation change petition before?",
          reviewLabel: "Ever filed a sex designation change petition?",
        }),
        node.subsection(
          [
            node.longText("previouslyFiledSexDesignationChangeDetails", {
              label: "Previous petition details",
              reviewLabel: "Previous sex designation change petition details",
              description: PREVIOUS_PETITION_DESCRIPTION,
            }),
          ],
          {
            when: (data) =>
              data.hasPreviouslyFiledSexDesignationChange === true,
          },
        ),
        node.yesNo("isProvidingReasonForGenderChange", {
          label:
            "Would you like to include your reasons for changing your sex designation?",
          reviewLabel: "Include reasons for sex designation change?",
        }),
        node.subsection(
          [
            node.longText("reasonForGenderChange", {
              label: "Reason for sex designation change",
            }),
          ],
          { when: (data) => data.isProvidingReasonForGenderChange === true },
        ),
      ],
    },
    {
      id: "seal-record",
      title: "Would you like your court record sealed?",
      description:
        "Your case is automatically kept private until the judge makes a decision. If public access to your record could put your safety at risk, you can ask the court to keep it sealed after that, too.",
      body: [
        node.yesNo("shouldSealCourtRecord", {
          reviewLabel: "Request sealing for personal safety?",
          yesLabel: "Yes, ask the court to keep my record sealed",
          noLabel:
            "No, it's okay for my record to be public after the decision",
        }),
        node.subsection(
          [
            node.longText("reasonToSealCourtRecord", {
              label: "Reason to seal the court record",
              reviewLabel: "Reason to seal court record",
              description: "Explain why you want to keep your case private.",
            }),
            node.banner(
              `**What do I write?** Explain how public access to your court record could affect your personal safety.

- Describe the privacy or safety concerns that apply to you.
- Be as specific to your personal situation as possible.`,
            ),
          ],
          { when: (data) => data.shouldSealCourtRecord === true },
        ),
      ],
    },
    {
      id: "supporting-documents",
      title: "Are you attaching supporting documents or additional pages?",
      body: [
        node.yesNo("hasAttachedSupportingDocuments", {
          reviewLabel: "Attaching supporting documents or pages?",
        }),
        node.subsection(
          [
            node.longText("supportingDocumentsDetails", {
              label: "Documents or additional pages",
              reviewLabel: "Supporting documents or additional pages",
              description: "List the name or a description of each document.",
            }),
          ],
          { when: (data) => data.hasAttachedSupportingDocuments === true },
        ),
      ],
    },
  ],
  pdfs: [
    {
      pdfId:
        "ucsnc1-name-change-and-or-sex-designation-change-petition-for-individual-adult",
    },
  ],
  downloadTitle: "New York Court Order",
  instructions: [
    "Sign and date the petition in both places on the last page. You don’t need a notary.",
    "File your petition with the court clerk in the county where you live.",
  ],
});
