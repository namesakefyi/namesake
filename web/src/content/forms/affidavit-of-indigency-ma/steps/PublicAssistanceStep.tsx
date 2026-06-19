import { CheckboxField } from "#components/forms/CheckboxField";
import { FormStep } from "#components/forms/FormStep";
import { defineStep } from "#lib/forms/defineStep";

export const publicAssistanceStep = defineStep({
  id: "public-assistance",
  title: "Which type of public assistance do you receive?",
  description: "Check all that apply.",
  when: (data) => data.indigencyBasis === "public-assistance",
  fields: [
    "isReceivingTAFDC",
    "isReceivingEAEDC",
    "isReceivingVeteransBenefits",
    "isReceivingMedicaid",
    "isReceivingSSI",
  ],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <CheckboxField
        name="isReceivingTAFDC"
        label="Transitional Aid to Families with Dependent Children (TAFDC)"
      />
      <CheckboxField
        name="isReceivingEAEDC"
        label="Emergency Aid to Elderly, Disabled or Children (EAEDC)"
      />
      <CheckboxField
        name="isReceivingVeteransBenefits"
        label="Massachusetts Veterans Benefits Programs"
      />
      <CheckboxField name="isReceivingMedicaid" label="Medicaid (MassHealth)" />
      <CheckboxField
        name="isReceivingSSI"
        label="Supplemental Security Income (SSI)"
      />
    </FormStep>
  ),
});
