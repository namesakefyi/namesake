import { NameChangeReasonBanner } from "#components/forms/NameChangeReasonBanner";
import type { FormData } from "#constants/fields";
import { defineForm } from "#lib/forms/defineForm";
import { nameOrFallback } from "#lib/forms/resolveStepContent";
import {
  anyTrue,
  block,
  field,
  is,
  isFalse,
  isNotTrue,
  isTrue,
} from "#lib/forms/steps";
import { deriveCurrentAge } from "#lib/utils/deriveCurrentAge";

/** The minor's first name, or "the minor" until it's known. */
const minor = (data: Partial<FormData>) => nameOrFallback(data, "the minor");

export default defineForm({
  steps: [
    {
      id: "new-name",
      title: "What is the minor's new name?",
      description: "This is the name being made official!",
      body: [field.name("newName")],
    },
    {
      id: "current-name",
      title: (data) => `What is ${minor(data)}'s current legal name?`,
      description:
        "This is the name being left behind. Type it exactly as it appears on the minor's ID.",
      body: [field.name("oldName")],
    },
    {
      id: "reason",
      title: (data) => `What is the reason ${minor(data)} is changing names?`,
      body: [
        field.longText("reasonForChangingName", {
          label: "Reason for name change",
        }),
        block.display(NameChangeReasonBanner, { props: { for: "child" } }),
      ],
    },
    {
      id: "presented-by",
      title: "Who is presenting this petition?",
      description: "Select all that apply.",
      body: [
        field.checkbox("isPresentedByLegalMotherParent1", {
          label: "Legal mother (or parent 1)",
          reviewLabel: "Presented by legal mother (parent 1)?",
        }),
        field.checkbox("isPresentedByLegalFatherParent2", {
          label: "Legal father (or parent 2)",
          reviewLabel: "Presented by legal father (parent 2)?",
        }),
        field.checkbox("isPresentedByCourtAppointedGuardian", {
          label: "Court-appointed guardian(s)",
          reviewLabel: "Presented by court-appointed guardian?",
        }),
      ],
    },
    {
      id: "date-of-birth",
      title: (data) => `What is ${minor(data)}'s date of birth?`,
      body: [
        field.memorableDate("dateOfBirth", { label: "Date of birth" }),
        block.banner(
          "The petitioner is over 18 years of age. Submit the [adult court order](/forms/court-order-ma) instead.",
          {
            variant: "warning",
            when: (data) => deriveCurrentAge(data.dateOfBirth) >= 18,
          },
        ),
        block.banner(
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
      id: "address",
      title: (data) => `What is ${minor(data)}'s address?`,
      description: (data) =>
        `You must file in the county where ${minor(data)} lives. We'll help you find where to file.`,
      body: [field.address("residence", { county: true })],
    },
    {
      id: "parent-info",
      title: "What are both parents' information?",
      description: (data) =>
        `List ${minor(data)}'s legal parents and contact information.`,
      body: [
        block.subsection(
          [
            field.shortText("parent1FullName", {
              label: "Full name",
              reviewLabel: "Parent 1 full name",
            }),
            field.phone("parent1Phone", { reviewLabel: "Parent 1 phone" }),
            field.email("parent1Email", { reviewLabel: "Parent 1 email" }),
          ],
          { title: "Legal mother (or parent 1)" },
        ),
        block.subsection(
          [
            field.shortText("parent2FullName", {
              label: "Full name",
              reviewLabel: "Parent 2 full name",
            }),
            field.phone("parent2Phone", { reviewLabel: "Parent 2 phone" }),
            field.email("parent2Email", { reviewLabel: "Parent 2 email" }),
          ],
          { title: "Legal father (or parent 2)" },
        ),
      ],
    },
    {
      id: "parent-address",
      title: (data) => `Where do ${minor(data)}'s parents live?`,
      body: [
        field.checkbox("parentsHaveUnknownAddresses", {
          label: "The addresses of the parents are unknown",
          reviewLabel: "Parents' addresses are unknown?",
        }),
        block.banner(
          "Since the address or whereabouts of legal parents are unknown, you must also file a [Motion for Service by Alternate Means and Affidavit of Diligent Search (CJP 31)](https://www.mass.gov/info-details/probate-and-family-court-motion-for-service-by-alternate-means-and-affidavit-of-diligent-search-cjp-31) with a [Military Affidavit (TC0002)](https://www.mass.gov/doc/military-affidavit/download).",
          { when: isTrue("parentsHaveUnknownAddresses") },
        ),
        block.subsection(
          [
            field.checkbox("parentsHaveDifferentAddresses", {
              label: "Parents have different addresses",
              reviewLabel: "Parents have different addresses?",
            }),
            block.subsection([field.address("parent1")], {
              title: (data) =>
                data.parentsHaveDifferentAddresses === true
                  ? "First parent's address"
                  : undefined,
            }),
            block.subsection([field.address("parent2")], {
              title: "Second parent's address",
              when: isTrue("parentsHaveDifferentAddresses"),
            }),
          ],
          { when: isNotTrue("parentsHaveUnknownAddresses") },
        ),
      ],
    },
    {
      id: "birth-certificate-parents",
      title: (data) =>
        `Are both parents listed on ${minor(data)}'s birth certificate?`,
      body: [
        field.yesNo("areBothParentsListedOnBirthCertificate", {
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
        field.yesNo("isALegalParentDeceased", {
          reviewLabel: "Is a legal parent deceased?",
          yesLabel: "Yes, one or more parents have died",
          noLabel: "No, both parents are living",
        }),
        block.banner(
          "We're sorry for your loss. When filing, the court requests that you attach a copy of the death certificate to your application.",
          { when: isTrue("isALegalParentDeceased") },
        ),
      ],
    },
    {
      id: "parental-rights-terminated",
      title: "Has either parent had their parental rights terminated?",
      body: [
        field.yesNo("hasLegalParentHadParentalRightsTerminated", {
          reviewLabel: "Has legal parent had parental rights terminated?",
        }),
        block.banner(
          "When filing, attach proof from the prior court proceeding.",
          { when: isTrue("hasLegalParentHadParentalRightsTerminated") },
        ),
      ],
    },
    {
      id: "guardian",
      title: (data) => `Does ${minor(data)} have a court-appointed guardian?`,
      body: [
        field.yesNo("hasCourtAppointedGuardian", {
          reviewLabel: "Court-appointed guardian?",
        }),
        block.subsection(
          [
            field.shortText("guardianFullName", {
              label: "Guardian full name",
            }),
            field.shortText("guardianStreetAddress", {
              label: "Street address",
              reviewLabel: "Guardian street address",
            }),
            field.shortText("guardianCity", {
              label: "City",
              reviewLabel: "Guardian city",
            }),
            field.comboBox("guardianState", {
              label: "State",
              reviewLabel: "Guardian state",
              placeholder: "Select state",
              source: "jurisdictions",
            }),
            field.shortText("guardianZipCode", {
              label: "ZIP code",
              reviewLabel: "Guardian zip code",
            }),
            field.phone("guardianPhone", { reviewLabel: "Guardian phone" }),
            field.email("guardianEmail", { reviewLabel: "Guardian email" }),
          ],
          {
            title: "Guardian information",
            when: isTrue("hasCourtAppointedGuardian"),
          },
        ),
      ],
    },
    {
      id: "co-guardian",
      title: (data) =>
        `Does ${minor(data)} have a court-appointed co-guardian?`,
      when: isTrue("hasCourtAppointedGuardian"),
      body: [
        field.yesNo("hasCourtAppointedCoGuardian", {
          reviewLabel: "Court-appointed co-guardian?",
        }),
        block.subsection(
          [
            field.shortText("coGuardianFullName", {
              label: "Co-guardian full name",
            }),
            field.shortText("coGuardianStreetAddress", {
              label: "Street address",
              reviewLabel: "Co-guardian street address",
            }),
            field.shortText("coGuardianCity", {
              label: "City",
              reviewLabel: "Co-guardian city",
            }),
            field.comboBox("coGuardianState", {
              label: "State",
              reviewLabel: "Co-guardian state",
              placeholder: "Select state",
              source: "jurisdictions",
            }),
            field.shortText("coGuardianZipCode", {
              label: "ZIP code",
              reviewLabel: "Co-guardian zip code",
            }),
            field.phone("coGuardianPhone", {
              reviewLabel: "Co-guardian phone",
            }),
            field.email("coGuardianEmail", {
              reviewLabel: "Co-guardian email",
            }),
          ],
          {
            title: "Co-guardian information",
            when: isTrue("hasCourtAppointedCoGuardian"),
          },
        ),
      ],
    },
    {
      id: "consent",
      title: "Does everyone consent to the name change?",
      body: [
        field.yesNo("isParent1Assenting", {
          label: "Does parent 1 consent to the name change?",
          reviewLabel: "Parent 1 assenting?",
        }),
        block.subsection(
          [
            field.longText("parent1DissentReason", {
              label: "Reason",
              reviewLabel: "Parent 1 dissent reason",
            }),
          ],
          { when: isFalse("isParent1Assenting") },
        ),
        field.yesNo("isParent2Assenting", {
          label: "Does parent 2 consent to the name change?",
          reviewLabel: "Parent 2 assenting?",
        }),
        block.subsection(
          [
            field.longText("parent2DissentReason", {
              label: "Reason",
              reviewLabel: "Parent 2 dissent reason",
            }),
          ],
          { when: isFalse("isParent2Assenting") },
        ),
        block.subsection(
          [
            field.yesNo("isAllGuardiansAssenting", {
              label:
                "Do all court-appointed guardians consent to the name change?",
              reviewLabel: "All guardians assenting?",
            }),
            block.subsection(
              [
                field.longText("guardianDissentReason", {
                  label: "Reason",
                  reviewLabel: "Guardian dissent reason",
                }),
              ],
              { when: isFalse("isAllGuardiansAssenting") },
            ),
          ],
          { when: isTrue("hasCourtAppointedGuardian") },
        ),
      ],
    },
    {
      id: "previous-name-change",
      title: (data) =>
        `Has ${minor(data)} ever changed their legal name before?`,
      body: [
        field.yesNo("hasPreviousNameChange", {
          reviewLabel: "Has previous name change?",
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
            title: "Please list the minor's past legal name.",
            when: isTrue("hasPreviousNameChange"),
          },
        ),
      ],
    },
    {
      id: "youth-services",
      title: (data) =>
        `Is ${minor(data)} under the supervision of the Massachusetts Department of Youth Services?`,
      body: [
        field.yesNo("isUnderSupervisionOfMassDeptOfYouthServices", {
          reviewLabel: "Under supervision of Mass. Dept. of Youth Services?",
        }),
      ],
    },
    {
      id: "interpreter",
      title: "If there is a hearing, does anyone need an interpreter?",
      description: "In most cases, a hearing is not required.",
      body: [
        field.checkbox("isInterpreterNeededForChild", {
          label: "The child needs an interpreter",
          reviewLabel: "Interpreter needed for child?",
        }),
        field.checkbox("isInterpreterNeededForParent1", {
          label: "Parent 1 needs an interpreter",
          reviewLabel: "Interpreter needed for parent 1?",
        }),
        field.checkbox("isInterpreterNeededForParent2", {
          label: "Parent 2 needs an interpreter",
          reviewLabel: "Interpreter needed for parent 2?",
        }),
        field.checkbox("isInterpreterNeededForGuardian", {
          label: "A guardian needs an interpreter",
          reviewLabel: "Interpreter needed for guardian?",
        }),
        block.subsection([field.languageSelect("language")], {
          when: anyTrue(
            "isInterpreterNeededForChild",
            "isInterpreterNeededForParent1",
            "isInterpreterNeededForParent2",
            "isInterpreterNeededForGuardian",
          ),
        }),
      ],
    },
    {
      id: "pronouns",
      title: (data) =>
        `Do you want to share ${minor(data)}'s pronouns with the court staff?`,
      body: [
        field.yesNo("isOkayToSharePronouns", {
          reviewLabel: "Okay to share pronouns?",
        }),
        block.subsection([field.pronounSelect()], {
          when: isTrue("isOkayToSharePronouns"),
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
      when: isTrue("parentsHaveUnknownAddresses"),
    },
    {
      text: "Attach a copy of the parental death certificate.",
      when: isTrue("isALegalParentDeceased"),
    },
    {
      text: "Attach court proof of parental termination of rights.",
      when: isTrue("hasLegalParentHadParentalRightsTerminated"),
    },
    "Remember to bring all supporting documents to the court.",
  ],
});
