import { FormStep } from "#components/forms/FormStep";
import { YesNoField } from "#components/forms/YesNoField";
import { defineStep } from "#forms/defineStep";
import { nameOrFallback } from "#forms/resolveStepContent";

export const youthServicesStep = defineStep({
  id: "youth-services",
  title: (data) =>
    `Is ${nameOrFallback(data, "the minor")} under the supervision of the Massachusetts Department of Youth Services?`,
  fields: ["isUnderSupervisionOfMassDeptOfYouthServices"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <YesNoField
        name="isUnderSupervisionOfMassDeptOfYouthServices"
        label="Is the minor under the supervision of the Massachusetts Department of Youth Services?"
        labelHidden
        yesLabel="Yes"
        noLabel="No"
      />
    </FormStep>
  ),
});
