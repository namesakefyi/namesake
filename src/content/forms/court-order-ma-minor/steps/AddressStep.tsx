import { AddressField } from "#components/forms/AddressField";
import { FormStep } from "#components/forms/FormStep";
import { defineStep } from "#lib/forms/defineStep";
import { nameOrFallback } from "#lib/forms/resolveStepContent";

export const addressStep = defineStep({
  id: "address",
  title: (data) => `What is ${nameOrFallback(data, "the minor")}'s address?`,
  description: (data) =>
    `You must file in the county where ${nameOrFallback(data, "the minor")} lives. We'll help you find where to file.`,
  fields: [
    "residenceStreetAddress",
    "residenceCity",
    "residenceCounty",
    "residenceState",
    "residenceZipCode",
  ],
  component: ({ stepConfig }) => {
    return (
      <FormStep stepConfig={stepConfig}>
        <AddressField type="residence" includeCounty />
      </FormStep>
    );
  },
});
