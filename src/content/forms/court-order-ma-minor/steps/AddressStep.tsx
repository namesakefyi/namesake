import { AddressField } from "../../../../components/forms/AddressField";
import { FormStep } from "../../../../components/forms/FormStep";
import { nameOrFallback } from "../../../../forms/resolveStepContent";
import type { Step } from "../../../../forms/types";

export const addressStep: Step = {
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
};
