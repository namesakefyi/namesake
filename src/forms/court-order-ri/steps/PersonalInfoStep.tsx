import { ComboBoxField } from "../../../components/forms/ComboBoxField";
import { FormStep } from "../../../components/forms/FormStep";
import { ShortTextField } from "../../../components/forms/ShortTextField";
import type { Step } from "../../../forms/types";

const MARITAL_STATUS_OPTIONS = [
  { label: "Single", value: "Single" },
  { label: "Married", value: "Married" },
  { label: "Divorced", value: "Divorced" },
  { label: "Widowed", value: "Widowed" },
];

export const personalInfoStep: Step = {
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
        options={MARITAL_STATUS_OPTIONS}
      />
    </FormStep>
  ),
};
