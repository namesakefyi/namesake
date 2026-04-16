import { useFormContext } from "react-hook-form";
import { Banner } from "../../../../components/common/Banner";
import { FormStep } from "../../../../components/forms/FormStep";
import { RadioGroupField } from "../../../../components/forms/RadioGroupField";
import type { Step } from "../../../../forms/types";

export const citizenshipStep: Step = {
  id: "citizenship",
  title: "What is your citizenship status?",
  fields: ["citizenshipStatus"],
  component: ({ stepConfig }) => {
    const form = useFormContext();
    const showWarning =
      form.watch("citizenshipStatus") === "other" ||
      form.watch("citizenshipStatus") === "legalAlienNotAllowedToWork";
    return (
      <FormStep stepConfig={stepConfig}>
        <RadioGroupField
          name="citizenshipStatus"
          label="Citizenship status"
          options={[
            { label: "U.S. Citizen", value: "usCitizen" },
            {
              label: "Legal Alien Allowed To Work",
              value: "legalAlienAllowedToWork",
            },
            {
              label: "Legal Alien Not Allowed To Work",
              value: "legalAlienNotAllowedToWork",
            },
            { label: "Other", value: "other" },
          ]}
        />
        {showWarning && (
          <Banner variant="warning">
            You must provide a document from a U.S. Federal, State, or local
            government agency that explains why you need a Social Security
            number and that you meet all the requirements for the government
            benefit.
          </Banner>
        )}
      </FormStep>
    );
  },
};
