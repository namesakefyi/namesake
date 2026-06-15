import { FormStep } from "#components/forms/FormStep";
import { NameField } from "#components/forms/NameField";
import { defineStep } from "#lib/forms/defineStep";

export const newNameStep = defineStep({
  id: "new-name",
  title: "What is the minor's new name?",
  description: "This is the name being made official!",
  fields: ["newFirstName", "newMiddleName", "newLastName"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <NameField type="newName" />
    </FormStep>
  ),
});
