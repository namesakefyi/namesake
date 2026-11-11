import { defineForm } from "#lib/forms/defineForm";
import { q } from "#lib/forms/questions";
import { USD_FORMAT } from "#lib/utils/formatCurrency";
import { MTPC_ASSISTANCE_URL, PovertyResult } from "./PovertyResult";

const amount = (name: string, reviewLabel: string) =>
  q.number(name, {
    label: "Amount (if known)",
    reviewLabel,
    minValue: 0,
    formatOptions: USD_FORMAT,
  });

export default defineForm({
  steps: [
    {
      id: "current-name",
      title: "What is your current legal name?",
      description:
        "This name will attach the fee waiver to your name change application.",
      questions: [q.name("oldName")],
    },
    {
      id: "address",
      title: "What is your residential address?",
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
          when: (data) => data.isCurrentlyUnhoused !== true,
        }),
      ],
    },
    {
      id: "indigency-basis",
      title: "Why are you requesting a fee waiver?",
      questions: [
        q.radioGroup("indigencyBasis", {
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
        q.banner(
          `You may be able to get help covering filing fees through the [Massachusetts Transgender Political Coalition's Identity Document Assistance network](${MTPC_ASSISTANCE_URL}).`,
          { when: (data) => data.indigencyBasis === "none" },
        ),
      ],
    },
    {
      id: "public-assistance",
      title: "Which type of public assistance do you receive?",
      description: "Check all that apply.",
      when: (data) => data.indigencyBasis === "public-assistance",
      questions: [
        q.checkbox("isReceivingTAFDC", {
          label: "Transitional Aid to Families with Dependent Children (TAFDC)",
          reviewLabel: "Receiving TAFDC?",
        }),
        q.checkbox("isReceivingEAEDC", {
          label: "Emergency Aid to Elderly, Disabled or Children (EAEDC)",
          reviewLabel: "Receiving EAEDC?",
        }),
        q.checkbox("isReceivingVeteransBenefits", {
          label: "Massachusetts Veterans Benefits Programs",
          reviewLabel: "Receiving veterans benefits?",
        }),
        q.checkbox("isReceivingMedicaid", {
          label: "Medicaid (MassHealth)",
          reviewLabel: "Receiving Medicaid?",
        }),
        q.checkbox("isReceivingSSI", {
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
      when: (data) => data.indigencyBasis === "income",
      questions: [
        q.number("incomeAmount", {
          label: "Income amount",
          minValue: 0,
          formatOptions: USD_FORMAT,
        }),
        q.radioGroup("incomePeriod", {
          label: "How often do you receive this income?",
          reviewLabel: "Income period",
          options: {
            weekly: "Weekly",
            biweekly: "Biweekly (every two weeks)",
            monthly: "Monthly",
            yearly: "Yearly",
          },
        }),
        q.number("householdSize", {
          label: "Total number of people in your household",
          reviewLabel: "Household size",
          minValue: 1,
        }),
        q.display(PovertyResult),
        q.number("numberOfDependents", {
          label: "Number of dependents",
          minValue: 0,
        }),
        q.number("otherHouseholdIncome", {
          label: "Other household income (optional)",
          reviewLabel: "Other household income",
          description:
            "Any other income available to your household for the same period you entered above",
          minValue: 0,
          defaultValue: 0,
          formatOptions: USD_FORMAT,
        }),
      ],
    },
    {
      id: "normal-fees",
      title: "Which court fees would you like waived?",
      description: "Check all that apply. Enter the amount if you know it.",
      questions: [
        q.costsTable(),
        q.checkbox("shouldWaiveFilingFeeAndSurcharge", {
          label: "Filing fee and any surcharge",
          reviewLabel: "Waive filing fee and surcharge?",
        }),
        q.subsection(
          [amount("filingFeeAndSurcharge", "Filing fee and surcharge amount")],
          { when: (data) => data.shouldWaiveFilingFeeAndSurcharge === true },
        ),
        q.checkbox("shouldWaiveFilingFeeAndSurchargeForAppeal", {
          label: "Filing fee and any surcharge for appeal (uncommon)",
          reviewLabel: "Waive filing fee and surcharge for appeal?",
        }),
        q.subsection(
          [
            amount(
              "filingFeeAndSurchargeForAppeal",
              "Filing fee and surcharge for appeal amount",
            ),
          ],
          {
            when: (data) =>
              data.shouldWaiveFilingFeeAndSurchargeForAppeal === true,
          },
        ),
        q.checkbox("shouldWaiveFeesForCourtSummons", {
          label:
            "Fees or costs for serving court summons, witness subpoenas, or other court papers",
          reviewLabel: "Waive fees for court summons?",
        }),
        q.subsection(
          [amount("feesForCourtSummons", "Fees for court summons amount")],
          { when: (data) => data.shouldWaiveFeesForCourtSummons === true },
        ),
        q.checkbox("shouldWaiveOtherFeesSection2", {
          label: "Other fees or costs",
          reviewLabel: "Waive other fees (Section 2)?",
        }),
        q.subsection(
          [
            amount("otherFeesSection2", "Other fees amount (Section 2)"),
            q.shortText("otherFeesSection2Details", {
              label: "What are these fees for?",
              reviewLabel: "Other fees details (Section 2)",
            }),
          ],
          { when: (data) => data.shouldWaiveOtherFeesSection2 === true },
        ),
        q.checkbox("shouldApplySubstitutionSection2", {
          label:
            "Ask the court to substitute a required service with a free or lower-cost alternative (uncommon)",
          reviewLabel: "Apply substitution (Section 2)?",
        }),
        q.subsection(
          [
            q.shortText("substitutionDetailsSection2", {
              label: "Describe the substitution",
              reviewLabel: "Substitution details (Section 2)",
            }),
          ],
          { when: (data) => data.shouldApplySubstitutionSection2 === true },
        ),
      ],
    },
    {
      id: "extra-fees",
      title: "Do you need any other costs waived?",
      description:
        "These are rare for name changes. If none apply, you can skip this step.",
      questions: [
        q.checkbox("shouldWaiveExpertServices", {
          label:
            "Expert services for testing, examination, testimony, or other assistance",
          reviewLabel: "Waive expert services?",
        }),
        q.subsection(
          [
            amount("costOfExpertServices", "Expert services cost"),
            q.shortText("expertServicesDetails", {
              label: "Describe the expert services needed",
              reviewLabel: "Expert services details",
            }),
          ],
          { when: (data) => data.shouldWaiveExpertServices === true },
        ),
        q.checkbox("shouldWaiveCostOfTranscription", {
          label: "Taking and/or transcribing a deposition",
          reviewLabel: "Waive cost of transcription?",
        }),
        q.subsection([amount("costOfTranscription", "Transcription cost")], {
          when: (data) => data.shouldWaiveCostOfTranscription === true,
        }),
        q.checkbox("shouldWaiveRecordingOfTrialForAppeal", {
          label:
            "Recording of trial for appeal (if you don't have a public defender)",
          reviewLabel: "Waive recording of trial for appeal?",
        }),
        q.checkbox("shouldWaiveAppealBond", {
          label: "Appeal bond",
          reviewLabel: "Waive appeal bond?",
        }),
        q.checkbox("shouldWaiveCostOfWrittenTranscriptPreparation", {
          label: "Preparing a written transcript of trial or other proceeding",
          reviewLabel: "Waive cost of written transcript preparation?",
        }),
        q.subsection(
          [
            amount(
              "costOfWrittenTranscriptPreparation",
              "Written transcript preparation cost",
            ),
          ],
          {
            when: (data) =>
              data.shouldWaiveCostOfWrittenTranscriptPreparation === true,
          },
        ),
        q.checkbox("shouldWaiveOtherFeesSection3", {
          label: "Other extra fees or costs",
          reviewLabel: "Waive other fees (Section 3)?",
        }),
        q.subsection(
          [
            amount("otherFeesSection3", "Other fees amount (Section 3)"),
            q.shortText("otherFeesSection3Details", {
              label: "What are these fees for?",
              reviewLabel: "Other fees details (Section 3)",
            }),
          ],
          { when: (data) => data.shouldWaiveOtherFeesSection3 === true },
        ),
        q.checkbox("shouldApplySubstitutionSection3", {
          label:
            "Ask the court to substitute one of these costs with a free or lower-cost alternative",
          reviewLabel: "Apply substitution (Section 3)?",
        }),
        q.subsection(
          [
            q.shortText("substitutionDetailsSection3", {
              label: "Describe the substitution",
              reviewLabel: "Substitution details (Section 3)",
            }),
          ],
          { when: (data) => data.shouldApplySubstitutionSection3 === true },
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
