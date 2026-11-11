import { NameChangeReasonBanner } from "#components/forms/NameChangeReasonBanner";
import cjp25 from "#content/pdfs/ma/cjp25-petition-to-change-name-of-minor";
import cjp34, {
  fillCjp34,
} from "#content/pdfs/ma/cjp34-cori-and-wms-release-request";
import { defineForm } from "#lib/forms/defineForm";
import type { Data } from "#lib/forms/questions";
import { q } from "#lib/forms/questions";
import { nameOrFallback } from "#lib/forms/resolveStepContent";
import { deriveCurrentAge } from "#lib/utils/deriveCurrentAge";
import { formatDateMMDDYYYY } from "#lib/utils/formatDateMMDDYYYY";
import { formatLanguage } from "#lib/utils/formatLanguage";
import { joinPronouns } from "#lib/utils/joinPronouns";

const minor = (data: Data) => nameOrFallback(data, "the minor");

/** Minors 12 and older also file a court activity record request (CJP 34). */
const needsRecordRequest = (data: Data) =>
  deriveCurrentAge(data.dateOfBirth) >= 12;

export default defineForm({
  title: "Court Order: Massachusetts (Under 18)",
  description:
    "If you live in Massachusetts, are under 18, and want to legally update your name, this is the place to start.",
  category: "court-order",
  unlisted: true,
  costs: [
    { title: "Filing fee", amount: 150, required: true },
    { title: "Surcharge fee", amount: 15, required: true },
  ],
  steps: [
    {
      id: "new-name",
      title: "What is the minor's new name?",
      description: "This is the name being made official!",
      questions: [q.name("newName")],
    },
    {
      id: "current-name",
      title: (data) => `What is ${minor(data)}'s current legal name?`,
      description:
        "This is the name being left behind. Type it exactly as it appears on the minor's ID.",
      questions: [q.name("oldName")],
    },
    {
      id: "reason",
      title: (data) => `What is the reason ${minor(data)} is changing names?`,
      questions: [
        q.longText("reasonForChangingName", {
          label: "Reason for name change",
        }),
        q.display(NameChangeReasonBanner, { props: { for: "child" } }),
      ],
    },
    {
      id: "presented-by",
      title: "Who is presenting this petition?",
      description: "Select all that apply.",
      questions: [
        q.checkbox("isPresentedByLegalMotherParent1", {
          label: "Legal mother (or parent 1)",
          reviewLabel: "Presented by legal mother (parent 1)?",
        }),
        q.checkbox("isPresentedByLegalFatherParent2", {
          label: "Legal father (or parent 2)",
          reviewLabel: "Presented by legal father (parent 2)?",
        }),
        q.checkbox("isPresentedByCourtAppointedGuardian", {
          label: "Court-appointed guardian(s)",
          reviewLabel: "Presented by court-appointed guardian?",
        }),
      ],
    },
    {
      id: "date-of-birth",
      title: (data) => `What is ${minor(data)}'s date of birth?`,
      questions: [
        q.memorableDate("dateOfBirth", { label: "Date of birth" }),
        q.banner(
          "The petitioner is over 18 years of age. Submit the [adult court order](/forms/ma/court-order) instead.",
          {
            when: (data) => deriveCurrentAge(data.dateOfBirth) >= 18,
            variant: "warning",
          },
        ),
        q.banner(
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
      id: "address",
      title: (data) => `What is ${minor(data)}'s address?`,
      description: (data) =>
        `You must file in the county where ${minor(data)} lives. We'll help you find where to file.`,
      questions: [q.address("residence", { county: true })],
    },
    {
      id: "parent-info",
      title: "What are both parents' information?",
      description: (data) =>
        `List ${minor(data)}'s legal parents and contact information.`,
      questions: [
        q.subsection(
          [
            q.name("parent1Name"),
            q.phone("parent1Phone", { reviewLabel: "Parent 1 phone" }),
            q.email("parent1Email", { reviewLabel: "Parent 1 email" }),
          ],
          { title: "Legal mother (or parent 1)" },
        ),
        q.subsection(
          [
            q.name("parent2Name"),
            q.phone("parent2Phone", { reviewLabel: "Parent 2 phone" }),
            q.email("parent2Email", { reviewLabel: "Parent 2 email" }),
          ],
          { title: "Legal father (or parent 2)" },
        ),
      ],
    },
    {
      id: "parent-address",
      title: (data) => `Where do ${minor(data)}'s parents live?`,
      questions: [
        q.checkbox("areParentAddressesUnknown", {
          label: "The addresses of the parents are unknown",
          reviewLabel: "Parents' addresses are unknown?",
        }),
        q.banner(
          "Since the address or whereabouts of legal parents are unknown, you must also file a [Motion for Service by Alternate Means and Affidavit of Diligent Search (CJP 31)](https://www.mass.gov/info-details/probate-and-family-court-motion-for-service-by-alternate-means-and-affidavit-of-diligent-search-cjp-31) with a [Military Affidavit (TC0002)](https://www.mass.gov/doc/military-affidavit/download).",
          { when: (data) => data.areParentAddressesUnknown === true },
        ),
        q.subsection(
          [
            q.checkbox("areParentAddressesDifferent", {
              label: "Parents have different addresses",
              reviewLabel: "Parents have different addresses?",
            }),
            q.subsection([q.address("parent1")], {
              title: (data) =>
                data.areParentAddressesDifferent === true
                  ? "First parent's address"
                  : undefined,
            }),
            q.subsection([q.address("parent2")], {
              when: (data) => data.areParentAddressesDifferent === true,
              title: "Second parent's address",
            }),
          ],
          { when: (data) => data.areParentAddressesUnknown !== true },
        ),
      ],
    },
    {
      id: "birth-certificate-parents",
      title: (data) =>
        `Are both parents listed on ${minor(data)}'s birth certificate?`,
      questions: [
        q.yesNo("areBothParentsListedOnBirthCertificate", {
          reviewLabel: "Both parents listed on the minor's birth certificate?",
          yesLabel: "Yes, both parents are listed",
          noLabel: "No, only one parent is listed",
        }),
      ],
    },
    {
      id: "parent-deceased",
      title: (data) => `Are any of ${minor(data)}'s legal parents deceased?`,
      questions: [
        q.yesNo("isALegalParentDeceased", {
          reviewLabel: "Is a legal parent deceased?",
          yesLabel: "Yes, one or more parents have died",
          noLabel: "No, both parents are living",
        }),
        q.banner(
          "We're sorry for your loss. When filing, the court requests that you attach a copy of the death certificate to your application.",
          { when: (data) => data.isALegalParentDeceased === true },
        ),
      ],
    },
    {
      id: "parental-rights-terminated",
      title: "Has either parent had their parental rights terminated?",
      questions: [
        q.yesNo("hasLegalParentHadParentalRightsTerminated", {
          reviewLabel: "Has legal parent had parental rights terminated?",
        }),
        q.banner("When filing, attach proof from the prior court proceeding.", {
          when: (data) =>
            data.hasLegalParentHadParentalRightsTerminated === true,
        }),
      ],
    },
    {
      id: "guardian",
      title: (data) => `Does ${minor(data)} have a court-appointed guardian?`,
      questions: [
        q.yesNo("hasCourtAppointedGuardian", {
          reviewLabel: "Court-appointed guardian?",
        }),
        q.subsection(
          [
            q.name("guardianName"),
            q.address("guardian"),
            q.phone("guardianPhone", { reviewLabel: "Guardian phone" }),
            q.email("guardianEmail", { reviewLabel: "Guardian email" }),
          ],
          {
            when: (data) => data.hasCourtAppointedGuardian === true,
            title: "Guardian information",
          },
        ),
      ],
    },
    {
      id: "co-guardian",
      title: (data) =>
        `Does ${minor(data)} have a court-appointed co-guardian?`,
      when: (data) => data.hasCourtAppointedGuardian === true,
      questions: [
        q.yesNo("hasCourtAppointedCoGuardian", {
          reviewLabel: "Court-appointed co-guardian?",
        }),
        q.subsection(
          [
            q.name("coGuardianName"),
            q.address("coGuardian"),
            q.phone("coGuardianPhone", {
              reviewLabel: "Co-guardian phone",
            }),
            q.email("coGuardianEmail", {
              reviewLabel: "Co-guardian email",
            }),
          ],
          {
            when: (data) => data.hasCourtAppointedCoGuardian === true,
            title: "Co-guardian information",
          },
        ),
      ],
    },
    {
      id: "consent",
      title: "Does everyone consent to the name change?",
      questions: [
        q.yesNo("isParent1Assenting", {
          label: "Does parent 1 consent to the name change?",
          reviewLabel: "Parent 1 assenting?",
        }),
        q.subsection(
          [
            q.longText("parent1DissentReason", {
              label: "Reason",
              reviewLabel: "Parent 1 dissent reason",
            }),
          ],
          { when: (data) => data.isParent1Assenting === false },
        ),
        q.yesNo("isParent2Assenting", {
          label: "Does parent 2 consent to the name change?",
          reviewLabel: "Parent 2 assenting?",
        }),
        q.subsection(
          [
            q.longText("parent2DissentReason", {
              label: "Reason",
              reviewLabel: "Parent 2 dissent reason",
            }),
          ],
          { when: (data) => data.isParent2Assenting === false },
        ),
        q.subsection(
          [
            q.yesNo("isAllGuardiansAssenting", {
              label:
                "Do all court-appointed guardians consent to the name change?",
              reviewLabel: "All guardians assenting?",
            }),
            q.subsection(
              [
                q.longText("guardianDissentReason", {
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
      questions: [
        q.yesNo("hasPreviousNameChange", {
          reviewLabel: "Has previous name change?",
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
            title: "Please list the minor's past legal name.",
          },
        ),
      ],
    },
    {
      id: "youth-services",
      title: (data) =>
        `Is ${minor(data)} under the supervision of the Massachusetts Department of Youth Services?`,
      questions: [
        q.yesNo("isUnderSupervisionOfMassDeptOfYouthServices", {
          reviewLabel: "Under supervision of Mass. Dept. of Youth Services?",
        }),
      ],
    },
    {
      id: "interpreter",
      title: "If there is a hearing, does anyone need an interpreter?",
      description: "In most cases, a hearing is not required.",
      questions: [
        q.checkbox("isInterpreterNeededForChild", {
          label: "The child needs an interpreter",
          reviewLabel: "Interpreter needed for child?",
        }),
        q.checkbox("isInterpreterNeededForParent1", {
          label: "Parent 1 needs an interpreter",
          reviewLabel: "Interpreter needed for parent 1?",
        }),
        q.checkbox("isInterpreterNeededForParent2", {
          label: "Parent 2 needs an interpreter",
          reviewLabel: "Interpreter needed for parent 2?",
        }),
        q.checkbox("isInterpreterNeededForGuardian", {
          label: "A guardian needs an interpreter",
          reviewLabel: "Interpreter needed for guardian?",
        }),
        q.subsection([q.languageSelect("language")], {
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
      id: "other-names",
      title: (data) => `Has ${minor(data)} ever used any other name or alias?`,
      description:
        "This includes any names used over a long period of time that were not changed legally.",
      when: needsRecordRequest,
      questions: [
        q.yesNo("hasUsedOtherNameOrAlias", {
          reviewLabel: "Has used other name or alias?",
        }),
        q.subsection(
          [
            q.longText("otherNamesOrAliases", {
              label: "Other names or aliases",
            }),
          ],
          { when: (data) => data.hasUsedOtherNameOrAlias === true },
        ),
      ],
    },
    {
      id: "mothers-maiden-name",
      title: (data) => `What is ${minor(data)}'s mother's maiden name?`,
      description:
        "The court requests this information in order to look up past court records and verify the minor's identity.",
      when: needsRecordRequest,
      questions: [
        q.shortText("mothersLastName", { label: "Mother's maiden name" }),
        q.banner(
          "The maiden name is the last name (or family name) of the minor's mother (or guardian) before marriage.",
        ),
      ],
    },
  ],
  download: {
    title: "Massachusetts Court Order (Minor)",
    instructions: [
      "Review all documents carefully.",
      "Do not sign the Petition to Change Name of Minor (CJP 25) until in the presence of a notary.",
      "File with the Probate and Family Court in your county.",
      {
        text: "Since the address or whereabouts of legal parent(s) is unknown, you must file a Motion for Service by Alternate Means and Affidavit of Diligent Search (CJP 31) with a Military Affidavit (TC0002).",
        when: (data) => data.areParentAddressesUnknown === true,
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
    pdfs: [
      {
        pdf: cjp25,
        fill: (data) => ({
          // Header
          petitionerFirstName: data.oldFirstName,
          petitionerMiddleName: data.oldMiddleName,
          petitionerLastName: data.oldLastName,
          county: data.residenceCounty,

          // 1. Petitioner (minor)
          oldFirstName: data.oldFirstName,
          oldMiddleName: data.oldMiddleName,
          oldLastName: data.oldLastName,

          // 2. Petition presented by
          isPresentedByLegalParent1: data.isPresentedByLegalMotherParent1,
          isPresentedByLegalParent2: data.isPresentedByLegalFatherParent2,
          isPresentedByLegalParent3: undefined,
          isPresentedByCourtAppointedGuardian:
            data.isPresentedByCourtAppointedGuardian,

          // 3. Minor's info
          dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
          currentAge: deriveCurrentAge(data.dateOfBirth)?.toString(),

          // 4. Minor's address
          mailingStreetAddress: data.residenceStreetAddress,
          mailingStreetAddress2: undefined,
          mailingCity: data.residenceCity,
          mailingState: data.residenceState,
          mailingZipCode: data.residenceZipCode,
          isUnderSupervisionOfMassDeptOfYouthServices:
            data.isUnderSupervisionOfMassDeptOfYouthServices,

          // 5. Has previous name change?
          hasPreviousNameChangeTrue: data.hasPreviousNameChange,
          hasPreviousNameChangeFalse: data.hasPreviousNameChange === false,
          previousNameFrom: data.previousNameFrom,
          previousNameTo: data.previousNameTo,
          previousNameReason: data.previousNameReason,

          // Assume return of certified docs
          shouldReturnOriginalDocuments: true,

          // 6. Legal parents
          parent1FirstName: data.parent1FirstName,
          parent1MiddleName: data.parent1MiddleName,
          parent1LastName: data.parent1LastName,
          parent1StreetAddress: data.parent1StreetAddress,
          parent1StreetAddress2: undefined,
          parent1City: data.parent1City,
          parent1State: data.parent1State,
          parent1ZipCode: data.parent1ZipCode,
          parent1Phone: data.parent1Phone,
          parent1Email: data.parent1Email,

          parent2FirstName: data.parent2FirstName,
          parent2MiddleName: data.parent2MiddleName,
          parent2LastName: data.parent2LastName,
          parent2StreetAddress:
            data.areParentAddressesDifferent === true
              ? data.parent2StreetAddress
              : data.parent1StreetAddress,
          parent2StreetAddress2: undefined,
          parent2City:
            data.areParentAddressesDifferent === true
              ? data.parent2City
              : data.parent1City,
          parent2State:
            data.areParentAddressesDifferent === true
              ? data.parent2State
              : data.parent1State,
          parent2ZipCode:
            data.areParentAddressesDifferent === true
              ? data.parent2ZipCode
              : data.parent1ZipCode,
          parent2Phone: data.parent2Phone,
          parent2Email: data.parent2Email,

          parent3FirstName: undefined,
          parent3MiddleName: undefined,
          parent3LastName: undefined,
          parent3StreetAddress: undefined,
          parent3StreetAddress2: undefined,
          parent3City: undefined,
          parent3State: undefined,
          parent3ZipCode: undefined,

          // Primary contact info
          phoneNumber: undefined,
          email: undefined,

          // Parental info
          isOnlyOneParentListedOnBirthCertificate:
            data.areBothParentsListedOnBirthCertificate === false,
          isALegalParentDeceased: data.isALegalParentDeceased,
          hasLegalParentHadParentalRightsTerminated:
            data.hasLegalParentHadParentalRightsTerminated,

          // 7. Court-appointed guardian
          hasCountAppointedGuardianFalse:
            data.hasCourtAppointedGuardian === false,
          hasCourtAppointedGuardianTrue: data.hasCourtAppointedGuardian,

          guardianFirstName: data.guardianFirstName,
          guardianMiddleName: data.guardianMiddleName,
          guardianLastName: data.guardianLastName,
          guardianStreetAddress: data.guardianStreetAddress,
          guardianStreetAddress2: undefined,
          guardianCity: data.guardianCity,
          guardianState: data.guardianState,
          guardianZipCode: data.guardianZipCode,
          guardianPhone: data.guardianPhone,
          guardianEmail: data.guardianEmail,

          coGuardianFirstName: data.coGuardianFirstName,
          coGuardianMiddleName: data.coGuardianMiddleName,
          coGuardianLastName: data.coGuardianLastName,
          coGuardianStreetAddress: data.coGuardianStreetAddress,
          coGuardianStreetAddress2: undefined,
          coGuardianCity: data.coGuardianCity,
          coGuardianState: data.coGuardianState,
          coGuardianZipCode: data.coGuardianZipCode,
          coGuardianPhone: data.coGuardianPhone,
          coGuardianEmail: data.coGuardianEmail,

          // 8. Child under 12?
          isChildUnder12: deriveCurrentAge(data.dateOfBirth) < 12,

          // 9. Legal parent 1 consents?
          isParent1AssentingTrue: data.isParent1Assenting,
          isParent1AssentingFalse: data.isParent1Assenting === false,
          parent1DissentReason: data.parent1DissentReason,

          // 10. Legal parent 2 consents?
          isParent2AssentingTrue: data.isParent2Assenting,
          isParent2AssentingFalse: data.isParent2Assenting === false,
          parent2DissentReason: data.parent2DissentReason,

          // 11. Legal parent 3 consents?
          isParent3AssentingTrue: undefined,
          isParent3AssentingFalse: undefined,
          parent3DissentReason: undefined,

          // 12. All court-appointed guardians consent?
          isAllGuardiansAssentingTrue: data.isAllGuardiansAssenting,
          isAllGuardiansAssentingFalse: data.isAllGuardiansAssenting === false,
          guardianDissentReason: data.guardianDissentReason,

          // 13. New name
          newFirstName: data.newFirstName,
          newMiddleName: data.newMiddleName,
          newLastName: data.newLastName,

          // 14. Reason for name change
          reasonForChangingName: data.reasonForChangingName,

          // 15. Text-only

          // 16. Interpreters needed?
          isInterpreterNeededForChild: data.isInterpreterNeededForChild,
          isInterpreterNeededForParent1: data.isInterpreterNeededForParent1,
          isInterpreterNeededForParent2: data.isInterpreterNeededForParent2,
          isInterpreterNeededForParent3: undefined,
          isInterpreterNeededForGuardian: data.isInterpreterNeededForGuardian,
          languages: formatLanguage(data.language),

          // 16. Okay to share pronouns?
          isOkayToSharePronouns: data.isOkayToSharePronouns,
          pronouns: joinPronouns(data.pronouns, data.otherPronouns),
        }),
      },
      { pdf: cjp34, when: needsRecordRequest, fill: fillCjp34 },
    ],
  },
});
