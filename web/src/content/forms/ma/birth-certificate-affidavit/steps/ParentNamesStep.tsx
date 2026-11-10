import { FormStep } from "#components/forms/FormStep";
import { ShortTextField } from "#components/forms/ShortTextField/ShortTextField.tsx";
import { defineStep } from "#lib/forms/defineStep";

export const parentNamesStep = defineStep({
  id: "parent-one",
  title: "What are your parents' names?",
  description:
    "Provide the names of the parents as listed on your birth certificate.",
  fields: ["parent1FullName", "parent2FullName"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <ShortTextField name="parent1FullName" label="Parent 1 full name" />
      <ShortTextField name="parent2FullName" label="Parent 2 full name" />
    </FormStep>
  ),
});
