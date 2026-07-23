import { EmailField } from "#components/forms/EmailField";
import { FormStep } from "#components/forms/FormStep";
import { PhoneField } from "#components/forms/PhoneField";
import { RadioGroupField } from "#components/forms/RadioGroupField";
import { defineStep } from "#lib/forms/defineStep";

export const contactInfoStep = defineStep({
  id: "contact-info",
  title: "What is your contact information?",
  description:
    "The Registry of Motor Vehicles will not provide your email or phone number to the public.",
  fields: ["email", "phoneType", "phoneNumber"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <EmailField name="email" />
      <RadioGroupField
        name="phoneType"
        label="Phone type"
        options={[
          { label: "Cell", value: "cell" },
          { label: "Home", value: "home" },
          { label: "Work", value: "work" },
        ]}
      />
      <PhoneField name="phoneNumber" />
    </FormStep>
  ),
});
