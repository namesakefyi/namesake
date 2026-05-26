import { CheckboxField } from "../../../../components/forms/CheckboxField";
import { FormStep } from "../../../../components/forms/FormStep";
import type { Step } from "../../../../forms/types";

export const presentedByStep: Step = {
  id: "presented-by",
  title: "Who is presenting this petition?",
  description: "Select all that apply.",
  fields: [
    "isPresentedByLegalParent1",
    "isPresentedByLegalParent2",
    "isPresentedByLegalParent3",
    "isPresentedByCourtAppointedGuardian",
  ],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <CheckboxField name="isPresentedByLegalParent1" label="Legal parent 1" />
      <CheckboxField name="isPresentedByLegalParent2" label="Legal parent 2" />
      <CheckboxField name="isPresentedByLegalParent3" label="Legal parent 3" />
      <CheckboxField
        name="isPresentedByCourtAppointedGuardian"
        label="Court-appointed guardian(s)"
      />
    </FormStep>
  ),
};
