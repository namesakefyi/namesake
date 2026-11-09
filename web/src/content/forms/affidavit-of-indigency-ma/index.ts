import { FormCostsTable } from "#components/forms/CostsTable";
import { defineForm } from "#lib/forms/defineForm";
import { block, field, is, isTrue, type StepNode } from "#lib/forms/steps";
import type {
  BooleanFieldName,
  StringFieldName,
  TextFieldName,
} from "#lib/forms/steps/types";
import { PovertyResult } from "./PovertyResult";

const MTPC_ASSISTANCE_URL = "https://www.masstpc.org/what-we-do/ida-network/";

/** An optional dollar amount for a fee. */
const amount = (name: StringFieldName, reviewLabel: string) =>
  field.number(name, {
    label: "Amount (if known)",
    reviewLabel,
    min: 0,
    currency: "dollars",
  });

/** A short description of what a fee is for. */
const details = (name: TextFieldName, label: string, reviewLabel: string) =>
  field.shortText(name, { label, reviewLabel });

/** A fee to waive, with follow-up questions shown once it's checked. */
const waiver = (
  name: BooleanFieldName,
  label: string,
  reviewLabel: string,
  followUps: readonly StepNode[] = [],
): StepNode[] => [
  field.checkbox(name, { label, reviewLabel }),
  ...(followUps.length > 0
    ? [block.subsection(followUps, { when: isTrue(name) })]
    : []),
];

export default defineForm({
  steps: [
    {
      id: "current-name",
      title: "What is your current legal name?",
      description:
        "This name will attach the fee waiver to your name change application.",
      body: [field.name("oldName")],
    },
    {
      id: "address",
      title: "What is your residential address?",
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
          when: (data) => data.isCurrentlyUnhoused !== true,
        }),
      ],
    },
    {
      id: "indigency-basis",
      title: "Why are you requesting a fee waiver?",
      body: [
        field.radioGroup("indigencyBasis", {
          reviewLabel: "Reason for indigency",
          options: {
            "public-assistance":
              "I receive public assistance (TAFDC, EAEDC, Veterans Benefits, Medicaid, or SSI)",
            income: "My income is at or below the poverty level",
            "unable-to-pay":
              "I cannot pay without depriving myself or my dependents of food, shelter, or clothing",
            none: "None of the above",
          },
        }),
        block.banner(
          `You may be able to get help covering filing fees through the [Massachusetts Transgender Political Coalition's Identity Document Assistance network](${MTPC_ASSISTANCE_URL}).`,
          { when: is("indigencyBasis", "none") },
        ),
      ],
    },
    {
      id: "public-assistance",
      title: "Which type of public assistance do you receive?",
      description: "Check all that apply.",
      when: is("indigencyBasis", "public-assistance"),
      body: [
        field.checkbox("isReceivingTAFDC", {
          label: "Transitional Aid to Families with Dependent Children (TAFDC)",
          reviewLabel: "Receiving TAFDC?",
        }),
        field.checkbox("isReceivingEAEDC", {
          label: "Emergency Aid to Elderly, Disabled or Children (EAEDC)",
          reviewLabel: "Receiving EAEDC?",
        }),
        field.checkbox("isReceivingVeteransBenefits", {
          label: "Massachusetts Veterans Benefits Programs",
          reviewLabel: "Receiving veterans benefits?",
        }),
        field.checkbox("isReceivingMedicaid", {
          label: "Medicaid (MassHealth)",
          reviewLabel: "Receiving Medicaid?",
        }),
        field.checkbox("isReceivingSSI", {
          label: "Supplemental Security Income (SSI)",
          reviewLabel: "Receiving SSI?",
        }),
      ],
    },
    {
      id: "income-poverty",
      title: "What is your income after taxes?",
      description:
        "We'll check whether your income qualifies you for a fee waiver based on the federal poverty level.",
      when: is("indigencyBasis", "income"),
      body: [
        field.number("incomeAmount", {
          label: "Income amount",
          min: 0,
          currency: "dollars",
        }),
        field.radioGroup("incomePeriod", {
          label: "How often do you receive this income?",
          reviewLabel: "Income period",
          options: {
            weekly: "Weekly",
            biweekly: "Biweekly (every two weeks)",
            monthly: "Monthly",
            yearly: "Yearly",
          },
        }),
        field.number("householdSize", {
          label: "Total number of people in your household",
          reviewLabel: "Household size",
          min: 1,
        }),
        block.display(PovertyResult, {
          reads: ["incomeAmount", "incomePeriod", "householdSize"],
        }),
        field.number("numberOfDependents", {
          label: "Number of dependents",
          min: 0,
        }),
        field.number("otherHouseholdIncome", {
          label: "Other household income (optional)",
          reviewLabel: "Other household income",
          description:
            "Any other income available to your household for the same period you entered above",
          min: 0,
          defaultValue: 0,
          currency: "dollars",
        }),
      ],
    },
    {
      id: "normal-fees",
      title: "Which court fees would you like waived?",
      description: "Check all that apply. Enter the amount if you know it.",
      body: [
        block.display(FormCostsTable),
        ...waiver(
          "shouldWaiveFilingFeeAndSurcharge",
          "Filing fee and any surcharge",
          "Waive filing fee and surcharge?",
          [amount("filingFeeAndSurcharge", "Filing fee and surcharge amount")],
        ),
        ...waiver(
          "shouldWaiveFilingFeeAndSurchargeForAppeal",
          "Filing fee and any surcharge for appeal (uncommon)",
          "Waive filing fee and surcharge for appeal?",
          [
            amount(
              "filingFeeAndSurchargeForAppeal",
              "Filing fee and surcharge for appeal amount",
            ),
          ],
        ),
        ...waiver(
          "shouldWaiveFeesForCourtSummons",
          "Fees or costs for serving court summons, witness subpoenas, or other court papers",
          "Waive fees for court summons?",
          [amount("feesForCourtSummons", "Fees for court summons amount")],
        ),
        ...waiver(
          "shouldWaiveOtherFeesSection2",
          "Other fees or costs",
          "Waive other fees (Section 2)?",
          [
            amount("otherFeesSection2", "Other fees amount (Section 2)"),
            details(
              "otherFeesSection2Details",
              "What are these fees for?",
              "Other fees details (Section 2)",
            ),
          ],
        ),
        ...waiver(
          "applySubstitutionSection2",
          "Ask the court to substitute a required service with a free or lower-cost alternative (uncommon)",
          "Apply substitution (Section 2)?",
          [
            details(
              "substitutionDetailsSection2",
              "Describe the substitution",
              "Substitution details (Section 2)",
            ),
          ],
        ),
      ],
    },
    {
      id: "extra-fees",
      title: "Do you need any other costs waived?",
      description:
        "These are rare for name changes. If none apply, you can skip this step.",
      body: [
        ...waiver(
          "shouldWaiveExpertServices",
          "Expert services for testing, examination, testimony, or other assistance",
          "Waive expert services?",
          [
            amount("costOfExpertServices", "Expert services cost"),
            details(
              "expertServicesDetails",
              "Describe the expert services needed",
              "Expert services details",
            ),
          ],
        ),
        ...waiver(
          "shouldWaiveCostOfTranscription",
          "Taking and/or transcribing a deposition",
          "Waive cost of transcription?",
          [amount("costOfTranscription", "Transcription cost")],
        ),
        ...waiver(
          "shouldWaiveRecordingOfTrialForAppeal",
          "Recording of trial for appeal (if you don't have a public defender)",
          "Waive recording of trial for appeal?",
        ),
        ...waiver("shouldWaiveAppealBond", "Appeal bond", "Waive appeal bond?"),
        ...waiver(
          "shouldWaiveCostOfWrittenTranscriptPreparation",
          "Preparing a written transcript of trial or other proceeding",
          "Waive cost of written transcript preparation?",
          [
            amount(
              "costOfWrittenTranscriptPreparation",
              "Written transcript preparation cost",
            ),
          ],
        ),
        ...waiver(
          "shouldWaiveOtherFeesSection3",
          "Other extra fees or costs",
          "Waive other fees (Section 3)?",
          [
            amount("otherFeesSection3", "Other fees amount (Section 3)"),
            details(
              "otherFeesSection3Details",
              "What are these fees for?",
              "Other fees details (Section 3)",
            ),
          ],
        ),
        ...waiver(
          "applySubstitutionSection3",
          "Ask the court to substitute one of these costs with a free or lower-cost alternative",
          "Apply substitution (Section 3)?",
          [
            details(
              "substitutionDetailsSection3",
              "Describe the substitution",
              "Substitution details (Section 3)",
            ),
          ],
        ),
      ],
    },
  ],
  pdfs: [{ pdfId: "affidavit-of-indigency" }],
  downloadTitle: "Affidavit of Indigency",
  instructions: [
    "Do not sign the Affidavit of Indigency until you are in the presence of a notary.",
    "File with the Probate and Family Court along with your other documents.",
  ],
});
