import { AddressField } from "#components/forms/AddressField";
import { FormStep } from "#components/forms/FormStep";
import { defineStep } from "#lib/forms/defineStep";

export const mailingAddressStep = defineStep({
  id: "address",
  title: "What is your mailing address?",
  fields: [
    "mailingStreetAddress",
    "mailingStreetAddress2",
    "mailingCity",
    "mailingState",
    "mailingZipCode",
  ],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <AddressField type="mailing" includeAddress2 />
    </FormStep>
  ),
});
