import { defineForm } from "#lib/forms/defineForm";
import { type Condition, q } from "#lib/forms/steps";

const copy = {
  governmentDocument:
    "You must provide a document from a U.S. Federal, State, or local government agency that explains why you need a Social Security number and that you meet all the requirements for the government benefit.",

  researchPurposes:
    "The Social Security Administration requests this information for research and statistical purposes.",
};

const needsGovernmentDocument: Condition = (data) =>
  data.citizenshipStatus === "legalAlienNotAllowedToWork" ||
  data.citizenshipStatus === "other";

export default defineForm({
  steps: [
    {
      id: "new-name",
      title: "What is your new name?",
      description: "This is the name that will show on your new card.",
      questions: [q.name("newName")],
    },
    {
      id: "old-name",
      title: "What was your name at birth?",
      description:
        "This is the name that appears on your original birth certificate.",
      questions: [q.name("oldName")],
    },
    {
      id: "previous-names",
      title: "Have you used any other legal names?",
      questions: [
        q.yesNo("hasOtherLegalNames", {
          reviewLabel: "Has other legal names?",
          noLabel: "No, I've never changed my name before",
        }),
        q.subsection(
          [
            q.longText("previousLegalNames", {
              label: "Other names used",
              reviewLabel: "Previous legal names",
            }),
          ],
          { when: (data) => data.hasOtherLegalNames === true },
        ),
      ],
    },
    {
      id: "birthplace",
      title: "Where were you born?",
      questions: [
        q.shortText("birthplaceCity", { label: "City of birth" }),
        q.comboBox("birthplaceCountry", {
          label: "Country",
          reviewLabel: "Country of birth",
          placeholder: "Select a country",
          source: "countries",
        }),
        q.comboBox("birthplaceState", {
          label: "State",
          reviewLabel: "State of birth",
          placeholder: "Select a state",
          source: "jurisdictions",
          when: (data) => data.birthplaceCountry === "US",
        }),
      ],
    },
    {
      id: "date-of-birth",
      title: "What is your date of birth?",
      questions: [q.memorableDate("dateOfBirth", { label: "Date of birth" })],
    },
    {
      id: "citizenship",
      title: "What is your citizenship status?",
      questions: [
        q.radioGroup("citizenshipStatus", {
          label: "Citizenship status",
          options: {
            usCitizen: "U.S. Citizen",
            legalAlienAllowedToWork: "Legal Alien Allowed To Work",
            legalAlienNotAllowedToWork: "Legal Alien Not Allowed To Work",
            other: "Other",
          },
        }),
        q.banner(copy.governmentDocument, {
          variant: "warning",
          when: needsGovernmentDocument,
        }),
      ],
    },
    {
      id: "ethnicity",
      title: "What is your ethnicity?",
      description:
        "This response is optional and does not affect your application. The Social Security Administration requests this information for research and statistical purposes.",
      questions: [
        q.yesNo("isHispanicOrLatino", {
          label: "Ethnicity",
          reviewLabel: "Hispanic or Latino?",
          yesLabel: "I am Hispanic or Latino",
          noLabel: "I am not Hispanic or Latino",
          extraChoices: ["preferNotToAnswer"],
        }),
        q.banner(copy.researchPurposes),
      ],
    },
    {
      id: "race",
      title: "What is your race?",
      description: "This response is optional.",
      questions: [
        q.checkboxGroup("race", {
          label: "Race",
          extraChoices: ["preferNotToAnswer"],
          options: {
            nativeHawaiian: "Native Hawaiian",
            alaskaNative: "Alaska Native",
            asian: "Asian",
            americanIndian: "American Indian",
            black: "Black or African American",
            otherPacificIslander: "Other Pacific Islander",
            white: "White",
          },
        }),
        q.banner(copy.researchPurposes),
      ],
    },
    {
      id: "sex",
      title: "What is your sex?",
      description:
        "The Social Security Administration accepts only two options: male or female.",
      questions: [
        q.radioGroup("sexAssignedAtBirth", {
          label: "Sex",
          reviewLabel: "Sex assigned at birth",
          options: { male: "Male", female: "Female" },
        }),
        q.banner(
          `**Namesake recommends selecting the same gender marker that the Social Security Administration already has on file.** The gender marker is not shown on your Social Security card.

As of January 20, 2025, the Trump administration has directed the Social Security Administration to [stop processing gender marker updates](https://www.whitehouse.gov/presidential-actions/2025/01/defending-women-from-gender-ideology-extremism-and-restoring-biological-truth-to-the-federal-government/) associated with social security records. Per [Lambda Legal](https://lambdalegal.org/tgnc-checklist-under-trump/#:~:text=If%20you%20apply%20for%20a%20gender%20marker%20change%20with%20Social%20Security%20now%2C%20you%20will%20likely%20be%20told%20that%20they%20cannot%20process%20your%20request.), if you apply for a gender marker change with Social Security now, you will likely be told that they cannot process your request.`,
          { variant: "warning" },
        ),
      ],
    },
    {
      id: "parent-one",
      title: "What is your mother's (or first parent's) name?",
      description:
        "Use your parent's name at their birth, before marriage. This is also known as a maiden name.",
      questions: [q.name("mothersName")],
    },
    {
      id: "parent-two",
      title: "What is your father's (or second parent's) name?",
      questions: [q.name("fathersName")],
    },
    {
      id: "previous-social-security-card",
      title: "Do you have a previous Social Security card?",
      description:
        "Or, have you ever filed for a Social Security number in the past?",
      questions: [
        q.yesNo("hasPreviousSocialSecurityCard", {
          reviewLabel: "Previous Social Security card?",
          yesLabel:
            "Yes, I have a previous Social Security card or have applied for one",
          noLabel:
            "No, I have never filed for or received a Social Security card before",
          extraChoices: ["dontKnow"],
        }),
        q.subsection([q.name("previousSocialSecurityCardName")], {
          title:
            "What is the name shown on your most recent Social Security card?",
          when: (data) => data.hasPreviousSocialSecurityCard === true,
        }),
      ],
    },
    {
      id: "phone-number",
      title: "What is your phone number?",
      questions: [q.phone("phoneNumber")],
    },
    {
      id: "address",
      title: "What is your mailing address?",
      questions: [q.address("mailing")],
    },
    {
      id: "filing-for-someone-else",
      title: "Are you filing this form for someone else?",
      questions: [
        q.yesNo("isFilingForSomeoneElse", {
          yesLabel: "Yes, I am filing this for someone else",
          noLabel: "No, I am filing this for myself",
        }),
        q.subsection(
          [
            q.radioGroup("relationshipToFilingFor", {
              reviewLabel: "Relationship to the person you are filing for",
              options: {
                parent: "Natural or Adoptive Parent",
                legalGuardian: "Legal Guardian",
                other: "Other",
              },
            }),
            q.shortText("relationshipToFilingForOther", {
              label: "Specify relationship",
              reviewLabel:
                "Relationship to the person you are filing for (other)",
              size: 34,
              when: (data) => data.relationshipToFilingFor === "other",
            }),
          ],
          {
            title:
              "What is your relationship to the person you are filing for?",
            when: (data) => data.isFilingForSomeoneElse === true,
          },
        ),
      ],
    },
  ],
  pdfs: [{ pdfId: "ss5-application-for-social-security-card" }],
  downloadTitle: "Social Security Card",
  instructions: [
    "Please review all documents carefully.",
    "Fill in your social security number—for security, Namesake never asks for this.",
    "Make an Appointment with a Social Security Administration Office.",
    "Remember to bring certified copies of your completed court order, along with other required supporting documents.",
    { text: copy.governmentDocument, when: needsGovernmentDocument },
  ],
});
