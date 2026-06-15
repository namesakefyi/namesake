import { AddressField } from "#components/forms/AddressField";
import { FormStep } from "#components/forms/FormStep";
import { defineStep } from "#lib/forms/defineStep";

export const addressStep = defineStep({
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
});
