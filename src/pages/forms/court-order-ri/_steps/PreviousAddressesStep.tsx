import { FormStep } from "../../../../components/forms/FormStep";
import { ShortTextField } from "../../../../components/forms/ShortTextField";
import type { Step } from "../../../../forms/types";

export const previousAddressesStep: Step = {
  id: "previous-addresses",
  title: "What are your three most recent addresses?",
  description: "List where you have resided prior to your current address.",
  fields: ["previousAddress1", "previousAddress2", "previousAddress3"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <ShortTextField name="previousAddress1" label="Address 1" size={40} />
      <ShortTextField name="previousAddress2" label="Address 2" size={40} />
      <ShortTextField name="previousAddress3" label="Address 3" size={40} />
    </FormStep>
  ),
};
