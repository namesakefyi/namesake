import { FormStep } from "#components/forms/FormStep";
import { NameField } from "#components/forms/NameField";
import { defineStep } from "#forms/defineStep";

export const newNameStep = defineStep({
  id: "new-name",
  title: "What is your new name?",
  description: "This is the name that will show on your new card.",
  fields: ["newFirstName", "newMiddleName", "newLastName"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <NameField type="newName" />
    </FormStep>
  ),
});
