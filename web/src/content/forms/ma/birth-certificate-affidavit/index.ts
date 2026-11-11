import { defineForm } from "#lib/forms/defineForm";
import { q } from "#lib/forms/questions";
import { deriveCurrentAge } from "#lib/utils/deriveCurrentAge";
import { joinNames } from "#lib/utils/joinNames";

const genderOptions = { Female: "Female", Male: "Male", X: "X" };

export default defineForm({
  steps: [
    {
      id: "birth-gender",
      title: "Which gender marker appears on your birth certificate?",
      questions: [
        q.radioGroup("oldGender", {
          options: genderOptions,
          reviewLabel: "Existing gender marker",
        }),
      ],
    },
    {
      id: "new-gender",
      title: "What is your new gender marker?",
      description:
        "This is the gender marker that will display on your amended birth certificate.",
      questions: [
        q.radioGroup("newGender", {
          options: genderOptions,
          reviewLabel: "Desired gender marker",
        }),
        q.banner(
          "Your birth and new gender markers are identical. Massachusetts doesn't allow people to amend their birth certificate if their gender markers are unchanged.",
          {
            when: (data) =>
              data.oldGender != null && data.oldGender === data.newGender,
            variant: "warning",
          },
        ),
      ],
    },
    {
      id: "birth-name",
      title: "What is the name on your current birth certificate?",
      questions: [q.name("oldName")],
    },
    {
      id: "new-name",
      title: "What is your new name?",
      description:
        "This is the name that will appear on your amended birth certificate.",
      questions: [q.name("newName")],
    },
    {
      id: "date-of-birth",
      title: "What is your date of birth?",
      questions: [q.memorableDate("dateOfBirth", { label: "Date of birth" })],
    },
    {
      id: "birthplace",
      title: "Where were you born?",
      questions: [
        q.shortText("birthplaceCity", {
          label: "City/town",
          reviewLabel: "City of birth",
        }),
      ],
    },
    {
      id: "parent-one",
      title: "What are your parents' names?",
      description:
        "Provide the names of the parents as listed on your birth certificate.",
      questions: [
        q.subsection([q.name("parent1Name")], { title: "Parent 1" }),
        q.subsection([q.name("parent2Name")], { title: "Parent 2" }),
      ],
    },
    {
      id: "address",
      title: "What is your mailing address?",
      questions: [q.address("mailing", { address2: true })],
    },
    {
      id: "contact-info",
      title: "What is your contact information?",
      description:
        "The government uses this to communicate with you about your filing status.",
      questions: [
        q.phone("phoneNumber"),
        q.email("email", { reviewLabel: "Email" }),
      ],
    },
    {
      id: "waive-costs",
      title: "Do you need to waive filing fees?",
      description:
        "To waive the fees, you'll need to file the Affidavit of Indigency. We can help you with that.",
      questions: [
        q.checkbox("shouldWaiveDocumentFees", {
          label: "Waive the fees",
          reviewLabel: "Waive fees?",
        }),
      ],
    },
    {
      id: "guardian-authorization-step",
      title: "Parent or guardian authorization",
      description:
        "Since you are under 18 years old, at least one parent or guardian must authorize this change.",
      when: (data) => deriveCurrentAge(data.dateOfBirth) < 18,
      questions: [
        q.subsection([q.name("guardianName")], {
          title: "Parent or guardian 1",
        }),
        q.subsection([q.name("coGuardianName")], {
          title: "Parent or guardian 2",
        }),
      ],
    },
  ],
  pdfs: [
    {
      pdfId:
        "r116-applicant-affidavit-in-support-of-amendment-of-a-birth-certificate-for-sex",
    },
  ],
  downloadTitle: "Massachusetts Birth Certificate Affidavit",
  instructions: [
    "Review all documents carefully.",
    "For a name change, you must first update your name with the Social Security Administration, then you must submit a legal name change order with the application.",
    {
      text: "Provide a court-certified copy of your legal name change decree",
      when: (data) =>
        joinNames(data.oldFirstName, data.oldMiddleName, data.oldLastName) !==
        joinNames(data.newFirstName, data.newMiddleName, data.newLastName),
    },
    "Sign and date the required fields.",
  ],
});
