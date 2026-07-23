import { FormStep } from "#components/forms/FormStep";
import { NameField } from "#components/forms/NameField";
import { ShortTextField } from "#components/forms/ShortTextField";
import { defineStep } from "#lib/forms/defineStep";

export const newNameStep = defineStep({
  id: "new-name",
  title: "What is your new legal name?",
  description:
    "Type your name exactly as it appears on your Social Security record.",
  fields: ["newFirstName", "newMiddleName", "newLastName", "nameSuffix"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <NameField type="newName" />
      <ShortTextField
        name="nameSuffix"
        label="Suffix (optional)"
        description="For example, Jr., Sr., II, or III."
        size={12}
      />
    </FormStep>
  ),
});
