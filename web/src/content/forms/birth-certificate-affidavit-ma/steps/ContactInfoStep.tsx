import { EmailField } from "#components/forms/EmailField";
import { FormStep } from "#components/forms/FormStep";
import { PhoneField } from "#components/forms/PhoneField";
import { defineStep } from "#lib/forms/defineStep";

export const contactInfoStep = defineStep({
  id: "contact-info",
  title: "What is your contact information?",
  description:
    "The government uses this to communicate with you about your filing status.",
  fields: ["phoneNumber", "email"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <PhoneField name="phoneNumber" />
      <EmailField name="email" />
    </FormStep>
  ),
});
