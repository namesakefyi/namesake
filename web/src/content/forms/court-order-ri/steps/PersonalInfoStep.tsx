import { ComboBoxField } from "#components/forms/ComboBoxField";
import { FormStep } from "#components/forms/FormStep";
import { ShortTextField } from "#components/forms/ShortTextField";
import { defineStep } from "#lib/forms/defineStep";
import { COMBO_BOX_SOURCES } from "#lib/forms/steps/comboBoxSources";

export const personalInfoStep = defineStep({
  id: "personal-info",
  title: "What is your occupation and marital status?",
  fields: ["occupation", "maritalStatus"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <ShortTextField name="occupation" label="Occupation" />
      <ComboBoxField
        name="maritalStatus"
        label="Marital status (optional)"
        placeholder="Select marital status"
        options={COMBO_BOX_SOURCES.maritalStatus}
      />
    </FormStep>
  ),
});
