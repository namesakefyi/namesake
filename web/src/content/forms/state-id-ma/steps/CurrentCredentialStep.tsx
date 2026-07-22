import { FormStep } from "#components/forms/FormStep";
import { NameField } from "#components/forms/NameField";
import { ShortTextField } from "#components/forms/ShortTextField";
import { defineStep } from "#lib/forms/defineStep";

export const currentCredentialStep = defineStep({
  id: "current-credential",
  title: "What appears on your current Massachusetts credential?",
  description:
    "Enter your current name and credential number so the RMV can find your record.",
  fields: [
    "oldFirstName",
    "oldMiddleName",
    "oldLastName",
    "currentMassachusettsCredentialNumber",
  ],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <NameField type="oldName" />
      <ShortTextField
        name="currentMassachusettsCredentialNumber"
        label="Current Massachusetts credential number"
        size={24}
      />
    </FormStep>
  ),
});
