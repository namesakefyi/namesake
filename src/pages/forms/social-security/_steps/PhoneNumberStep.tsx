import { FormStep } from "../../../../components/forms/FormStep";
import { PhoneField } from "../../../../components/forms/PhoneField";
import type { Step } from "../../../../forms/types";

export const phoneNumberStep: Step = {
  id: "phone-number",
  title: "What is your phone number?",
  fields: ["phoneNumber"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <PhoneField name="phoneNumber" />
    </FormStep>
  ),
};
