import { FormStep } from "#components/forms/FormStep";
import { NameField } from "#components/forms/NameField";
import { defineStep } from "#forms/defineStep";

export const newNameStep = defineStep({
  id: "new-name",
  title: "What is your new name?",
  description:
    "This is the name you're making official! Type it exactly as you want it to appear.",
  fields: ["newFirstName", "newMiddleName", "newLastName"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <NameField type="newName" />
    </FormStep>
  ),
});
