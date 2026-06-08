import { AddressField } from "../../../../components/forms/AddressField";
import { FormStep } from "../../../../components/forms/FormStep";
import type { Step } from "../../../../forms/types";

export const addressStep: Step = {
  id: "address",
  title: "What is your mailing address?",
  fields: [
    "isCurrentlyUnhoused",
    "mailingStreetAddress",
    "mailingCity",
    "mailingState",
    "mailingZipCode",
  ],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <AddressField type="mailing" />
    </FormStep>
  ),
};
