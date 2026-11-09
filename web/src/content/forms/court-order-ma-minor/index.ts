import { NameChangeReasonBanner } from "#components/forms/NameChangeReasonBanner";
import type { FormData } from "#constants/fields";
import { defineForm } from "#lib/forms/defineForm";
import { nameOrFallback } from "#lib/forms/resolveStepContent";
import { node } from "#lib/forms/steps";
import { deriveCurrentAge } from "#lib/utils/deriveCurrentAge";

const minor = (data: Partial<FormData>) => nameOrFallback(data, "the minor");

export default defineForm({
  steps: [
    {
      id: "new-name",
      title: "What is the minor's new name?",
      description: "This is the name being made official!",
      body: [node.name("newName")],
    },
    {
      id: "current-name",
      title: (data) => `What is ${minor(data)}'s current legal name?`,
      description:
        "This is the name being left behind. Type it exactly as it appears on the minor's ID.",
      body: [node.name("oldName")],
    },
    {
      id: "reason",
      title: (data) => `What is the reason ${minor(data)} is changing names?`,
      body: [
        node.longText("reasonForChangingName", {
          label: "Reason for name change",
        }),
        node.display(NameChangeReasonBanner, { props: { for: "child" } }),
      ],
    },
    {
      id: "presented-by",
      title: "Who is presenting this petition?",
      description: "Select all that apply.",
      body: [
        node.checkbox("isPresentedByLegalMotherParent1", {
          label: "Legal mother (or parent 1)",
          reviewLabel: "Presented by legal mother (parent 1)?",
        }),
        node.checkbox("isPresentedByLegalFatherParent2", {
          label: "Legal father (or parent 2)",
          reviewLabel: "Presented by legal father (parent 2)?",
        }),
        node.checkbox("isPresentedByCourtAppointedGuardian", {
          label: "Court-appointed guardian(s)",
          reviewLabel: "Presented by court-appointed guardian?",
        }),
      ],
    },
    {
      id: "date-of-birth",
      title: (data) => `What is ${minor(data)}'s date of birth?`,
      body: [
        node.memorableDate("dateOfBirth", { label: "Date of birth" }),
        node.banner(
          "The petitioner is over 18 years of age. Submit the [adult court order](/forms/court-order-ma) instead.",
          {
            variant: "warning",
            when: (data) => deriveCurrentAge(data.dateOfBirth) >= 18,
          },
        ),
        node.banner(
          "Since the minor is 12 years of age or older, **the child's written notarized assent must be obtained before filing this petition**. You will fill this out after downloading and printing the final packet.",
          {
            when: (data) => {
              const age = deriveCurrentAge(data.dateOfBirth);
              return age >= 12 && age < 18;
            },
          },
        ),
      ],
    },
    {
      id: "birthplace",
      title: (data) => `Where was ${minor(data)} born?`,
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
      id: "address",
      title: (data) => `What is ${minor(data)}'s address?`,
      description: (data) =>
        `You must file in the county where ${minor(data)} lives. We'll help you find where to file.`,
      body: [node.address("residence", { county: true })],
    },
    {
      id: "parent-info",
      title: "What are both parents' information?",
      description: (data) =>
        `List ${minor(data)}'s legal parents and contact information.`,
      body: [
        node.subsection(
          [
            node.shortText("parent1FullName", {
              label: "Full name",
              reviewLabel: "Parent 1 full name",
            }),
            node.phone("parent1Phone", { reviewLabel: "Parent 1 phone" }),
            node.email("parent1Email", { reviewLabel: "Parent 1 email" }),
          ],
          { title: "Legal mother (or parent 1)" },
        ),
        node.subsection(
          [
            node.shortText("parent2FullName", {
              label: "Full name",
              reviewLabel: "Parent 2 full name",
            }),
            node.phone("parent2Phone", { reviewLabel: "Parent 2 phone" }),
            node.email("parent2Email", { reviewLabel: "Parent 2 email" }),
          ],
          { title: "Legal father (or parent 2)" },
        ),
      ],
    },
    {
      id: "parent-address",
      title: (data) => `Where do ${minor(data)}'s parents live?`,
      body: [
        node.checkbox("parentsHaveUnknownAddresses", {
          label: "The addresses of the parents are unknown",
          reviewLabel: "Parents' addresses are unknown?",
        }),
        node.banner(
          "Since the address or whereabouts of legal parents are unknown, you must also file a [Motion for Service by Alternate Means and Affidavit of Diligent Search (CJP 31)](https://www.mass.gov/info-details/probate-and-family-court-motion-for-service-by-alternate-means-and-affidavit-of-diligent-search-cjp-31) with a [Military Affidavit (TC0002)](https://www.mass.gov/doc/military-affidavit/download).",
          { when: (data) => data.parentsHaveUnknownAddresses === true },
        ),
        node.subsection(
          [
            node.checkbox("parentsHaveDifferentAddresses", {
              label: "Parents have different addresses",
              reviewLabel: "Parents have different addresses?",
            }),
            node.subsection([node.address("parent1")], {
              title: (data) =>
                data.parentsHaveDifferentAddresses === true
                  ? "First parent's address"
                  : undefined,
            }),
            node.subsection([node.address("parent2")], {
              title: "Second parent's address",
              when: (data) => data.parentsHaveDifferentAddresses === true,
            }),
          ],
          { when: (data) => data.parentsHaveUnknownAddresses !== true },
        ),
      ],
    },
    {
      id: "birth-certificate-parents",
      title: (data) =>
        `Are both parents listed on ${minor(data)}'s birth certificate?`,
      body: [
        node.yesNo("areBothParentsListedOnBirthCertificate", {
          reviewLabel: "Both parents listed on the minor's birth certificate?",
          yesLabel: "Yes, both parents are listed",
          noLabel: "No, only one parent is listed",
        }),
      ],
    },
    {
      id: "parent-deceased",
      title: (data) => `Are any of ${minor(data)}'s legal parents deceased?`,
      body: [
        node.yesNo("isALegalParentDeceased", {
          reviewLabel: "Is a legal parent deceased?",
          yesLabel: "Yes, one or more parents have died",
          noLabel: "No, both parents are living",
        }),
        node.banner(
          "We're sorry for your loss. When filing, the court requests that you attach a copy of the death certificate to your application.",
          { when: (data) => data.isALegalParentDeceased === true },
        ),
      ],
    },
    {
      id: "parental-rights-terminated",
      title: "Has either parent had their parental rights terminated?",
      body: [
        node.yesNo("hasLegalParentHadParentalRightsTerminated", {
          reviewLabel: "Has legal parent had parental rights terminated?",
        }),
        node.banner(
          "When filing, attach proof from the prior court proceeding.",
          {
            when: (data) =>
              data.hasLegalParentHadParentalRightsTerminated === true,
          },
        ),
      ],
    },
    {
      id: "guardian",
      title: (data) => `Does ${minor(data)} have a court-appointed guardian?`,
      body: [
        node.yesNo("hasCourtAppointedGuardian", {
          reviewLabel: "Court-appointed guardian?",
        }),
        node.subsection(
          [
            node.shortText("guardianFullName", {
              label: "Guardian full name",
            }),
            node.shortText("guardianStreetAddress", {
              label: "Street address",
              reviewLabel: "Guardian street address",
            }),
            node.shortText("guardianCity", {
              label: "City",
              reviewLabel: "Guardian city",
            }),
            node.comboBox("guardianState", {
              label: "State",
              reviewLabel: "Guardian state",
              placeholder: "Select state",
              source: "jurisdictions",
            }),
            node.shortText("guardianZipCode", {
              label: "ZIP code",
              reviewLabel: "Guardian zip code",
            }),
            node.phone("guardianPhone", { reviewLabel: "Guardian phone" }),
            node.email("guardianEmail", { reviewLabel: "Guardian email" }),
          ],
          {
            title: "Guardian information",
            when: (data) => data.hasCourtAppointedGuardian === true,
          },
        ),
      ],
    },
    {
      id: "co-guardian",
      title: (data) =>
        `Does ${minor(data)} have a court-appointed co-guardian?`,
      when: (data) => data.hasCourtAppointedGuardian === true,
      body: [
        node.yesNo("hasCourtAppointedCoGuardian", {
          reviewLabel: "Court-appointed co-guardian?",
        }),
        node.subsection(
          [
            node.shortText("coGuardianFullName", {
              label: "Co-guardian full name",
            }),
            node.shortText("coGuardianStreetAddress", {
              label: "Street address",
              reviewLabel: "Co-guardian street address",
            }),
            node.shortText("coGuardianCity", {
              label: "City",
              reviewLabel: "Co-guardian city",
            }),
            node.comboBox("coGuardianState", {
              label: "State",
              reviewLabel: "Co-guardian state",
              placeholder: "Select state",
              source: "jurisdictions",
            }),
            node.shortText("coGuardianZipCode", {
              label: "ZIP code",
              reviewLabel: "Co-guardian zip code",
            }),
            node.phone("coGuardianPhone", {
              reviewLabel: "Co-guardian phone",
            }),
            node.email("coGuardianEmail", {
              reviewLabel: "Co-guardian email",
            }),
          ],
          {
            title: "Co-guardian information",
            when: (data) => data.hasCourtAppointedCoGuardian === true,
          },
        ),
      ],
    },
    {
      id: "consent",
      title: "Does everyone consent to the name change?",
      body: [
        node.yesNo("isParent1Assenting", {
          label: "Does parent 1 consent to the name change?",
          reviewLabel: "Parent 1 assenting?",
        }),
        node.subsection(
          [
            node.longText("parent1DissentReason", {
              label: "Reason",
              reviewLabel: "Parent 1 dissent reason",
            }),
          ],
          { when: (data) => data.isParent1Assenting === false },
        ),
        node.yesNo("isParent2Assenting", {
          label: "Does parent 2 consent to the name change?",
          reviewLabel: "Parent 2 assenting?",
        }),
        node.subsection(
          [
            node.longText("parent2DissentReason", {
              label: "Reason",
              reviewLabel: "Parent 2 dissent reason",
            }),
          ],
          { when: (data) => data.isParent2Assenting === false },
        ),
        node.subsection(
          [
            node.yesNo("isAllGuardiansAssenting", {
              label:
                "Do all court-appointed guardians consent to the name change?",
              reviewLabel: "All guardians assenting?",
            }),
            node.subsection(
              [
                node.longText("guardianDissentReason", {
                  label: "Reason",
                  reviewLabel: "Guardian dissent reason",
                }),
              ],
              { when: (data) => data.isAllGuardiansAssenting === false },
            ),
          ],
          { when: (data) => data.hasCourtAppointedGuardian === true },
        ),
      ],
    },
    {
      id: "previous-name-change",
      title: (data) =>
        `Has ${minor(data)} ever changed their legal name before?`,
      body: [
        node.yesNo("hasPreviousNameChange", {
          reviewLabel: "Has previous name change?",
        }),
        node.subsection(
          [
            node.shortText("previousNameFrom", {
              label: "From",
              reviewLabel: "Previous name from",
            }),
            node.shortText("previousNameTo", {
              label: "To",
              reviewLabel: "Previous name to",
            }),
            node.longText("previousNameReason", {
              label: "Reason for change",
              reviewLabel: "Previous name reason",
            }),
          ],
          {
            title: "Please list the minor's past legal name.",
            when: (data) => data.hasPreviousNameChange === true,
          },
        ),
      ],
    },
    {
      id: "youth-services",
      title: (data) =>
        `Is ${minor(data)} under the supervision of the Massachusetts Department of Youth Services?`,
      body: [
        node.yesNo("isUnderSupervisionOfMassDeptOfYouthServices", {
          reviewLabel: "Under supervision of Mass. Dept. of Youth Services?",
        }),
      ],
    },
    {
      id: "interpreter",
      title: "If there is a hearing, does anyone need an interpreter?",
      description: "In most cases, a hearing is not required.",
      body: [
        node.checkbox("isInterpreterNeededForChild", {
          label: "The child needs an interpreter",
          reviewLabel: "Interpreter needed for child?",
        }),
        node.checkbox("isInterpreterNeededForParent1", {
          label: "Parent 1 needs an interpreter",
          reviewLabel: "Interpreter needed for parent 1?",
        }),
        node.checkbox("isInterpreterNeededForParent2", {
          label: "Parent 2 needs an interpreter",
          reviewLabel: "Interpreter needed for parent 2?",
        }),
        node.checkbox("isInterpreterNeededForGuardian", {
          label: "A guardian needs an interpreter",
          reviewLabel: "Interpreter needed for guardian?",
        }),
        node.subsection([node.languageSelect("language")], {
          when: (data) =>
            data.isInterpreterNeededForChild === true ||
            data.isInterpreterNeededForParent1 === true ||
            data.isInterpreterNeededForParent2 === true ||
            data.isInterpreterNeededForGuardian === true,
        }),
      ],
    },
    {
      id: "pronouns",
      title: (data) =>
        `Do you want to share ${minor(data)}'s pronouns with the court staff?`,
      body: [
        node.yesNo("isOkayToSharePronouns", {
          reviewLabel: "Okay to share pronouns?",
        }),
        node.subsection([node.pronounSelect()], {
          when: (data) => data.isOkayToSharePronouns === true,
        }),
      ],
    },
  ],
  pdfs: [
    { pdfId: "cjp25-petition-to-change-name-of-minor" },
    {
      pdfId: "cjp34-cori-and-wms-release-request",
      when: (data) => deriveCurrentAge(data.dateOfBirth) >= 12,
    },
    // TODO: Add CJP 31 and TC0002 PDFs
  ],
  downloadTitle: "Massachusetts Court Order (Minor)",
  instructions: [
    "Review all documents carefully.",
    "Do not sign the Petition to Change Name of Minor (CJP 25) until in the presence of a notary.",
    "File with the Probate and Family Court in your county.",
    {
      text: "Since the address or whereabouts of legal parent(s) is unknown, you must file a Motion for Service by Alternate Means and Affidavit of Diligent Search (CJP 31) with a Military Affidavit (TC0002).",
      when: (data) => data.parentsHaveUnknownAddresses === true,
    },
    {
      text: "Attach a copy of the parental death certificate.",
      when: (data) => data.isALegalParentDeceased === true,
    },
    {
      text: "Attach court proof of parental termination of rights.",
      when: (data) => data.hasLegalParentHadParentalRightsTerminated === true,
    },
    "Remember to bring all supporting documents to the court.",
  ],
});
