import { EmailField } from "../../../../components/forms/EmailField";
import {
  FormStep,
  FormSubsection,
} from "../../../../components/forms/FormStep";
import { PhoneField } from "../../../../components/forms/PhoneField";
import { ShortTextField } from "../../../../components/forms/ShortTextField";
import { nameOrFallback } from "../../../../forms/resolveStepContent";
import type { Step } from "../../../../forms/types";

export const parentInfoStep: Step = {
  id: "parent-info",
  title: "What are both parents' information?",
  description: (data) =>
    `List ${nameOrFallback(data, "the minor")}'s legal parents and contact information.`,
  fields: [
    "parent1FullName",
    "parent1Phone",
    "parent1Email",
    "parent2FullName",
    "parent2Phone",
    "parent2Email",
  ],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <FormSubsection title="Legal mother (or parent 1)">
        <ShortTextField name="parent1FullName" label="Full name" />
        <PhoneField name="parent1Phone" />
        <EmailField name="parent1Email" />
      </FormSubsection>
      <FormSubsection title="Legal father (or parent 2)">
        <ShortTextField name="parent2FullName" label="Full name" />
        <PhoneField name="parent2Phone" />
        <EmailField name="parent2Email" />
      </FormSubsection>
    </FormStep>
  ),
};
