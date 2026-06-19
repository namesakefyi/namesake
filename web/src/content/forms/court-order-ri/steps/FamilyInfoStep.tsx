import { FormStep, FormSubsection } from "#components/forms/FormStep";
import { NameField } from "#components/forms/NameField";
import { defineStep } from "#lib/forms/defineStep";

export const familyInfoStep = defineStep({
  id: "family-info",
  title: "What are your parents' names?",
  fields: [
    "mothersFirstName",
    "mothersMiddleName",
    "mothersLastName",
    "fathersFirstName",
    "fathersMiddleName",
    "fathersLastName",
  ],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <FormSubsection title="Mother's maiden name">
        <NameField type="mothersName" />
      </FormSubsection>
      <FormSubsection title="Father's name">
        <NameField type="fathersName" />
      </FormSubsection>
    </FormStep>
  ),
});
