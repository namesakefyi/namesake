import { FormStep } from "../../../../components/forms/FormStep";
import { YesNoField } from "../../../../components/forms/YesNoField";
import { defineStep } from "../../../../forms/defineStep";
import { nameOrFallback } from "../../../../forms/resolveStepContent";

export const birthCertificateParentsStep = defineStep({
  id: "birth-certificate-parents",
  title: (data) =>
    `Are both parents listed on ${nameOrFallback(data, "the minor")}'s birth certificate?`,
  fields: ["areBothParentsListedOnBirthCertificate"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <YesNoField
        name="areBothParentsListedOnBirthCertificate"
        label="Are both parents listed on the minor's birth certificate?"
        labelHidden
        yesLabel="Yes, both parents are listed"
        noLabel="No, only one parent is listed"
      />
    </FormStep>
  ),
});
