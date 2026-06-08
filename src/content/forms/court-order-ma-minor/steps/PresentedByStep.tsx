import { CheckboxField } from "../../../../components/forms/CheckboxField";
import { FormStep } from "../../../../components/forms/FormStep";
import type { Step } from "../../../../forms/types";

export const presentedByStep: Step = {
  id: "presented-by",
  title: "Who is presenting this petition?",
  description: "Select all that apply.",
  fields: [
    "isPresentedByLegalMotherParent1",
    "isPresentedByLegalFatherParent2",
    "isPresentedByCourtAppointedGuardian",
  ],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <CheckboxField
        name="isPresentedByLegalMotherParent1"
        label="Legal mother (or parent 1)"
      />
      <CheckboxField
        name="isPresentedByLegalFatherParent2"
        label="Legal father (or parent 2)"
      />
      <CheckboxField
        name="isPresentedByCourtAppointedGuardian"
        label="Court-appointed guardian(s)"
      />
    </FormStep>
  ),
};
