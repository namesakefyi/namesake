import { FormStep } from "../../../../components/forms/FormStep";
import { PhoneField } from "../../../../components/forms/PhoneField";
import { defineStep } from "../../../../forms/defineStep";

export const phoneNumberStep = defineStep({
  id: "phone-number",
  title: "What is your phone number?",
  fields: ["phoneNumber"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <PhoneField name="phoneNumber" />
    </FormStep>
  ),
});
