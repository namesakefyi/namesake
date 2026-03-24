import { ComboBoxField } from "@/components/react/forms/ComboBoxField";
import { FormStep, useFieldVisible } from "@/components/react/forms/FormStep";
import { ShortTextField } from "@/components/react/forms/ShortTextField";
import { COUNTRIES } from "@/constants/countries";
import { JURISDICTIONS } from "@/constants/jurisdictions";
import type { Step } from "@/forms/types";

export const birthplaceStep: Step = {
  id: "birthplace",
  title: "Where were you born?",
  fields: [
    "birthplaceCity",
    "birthplaceCountry",
    {
      id: "birthplaceState",
      when: (data) => data.birthplaceCountry === "US",
    },
  ],
  component: ({ stepConfig }) => {
    const stateVisible = useFieldVisible(stepConfig, "birthplaceState");
    return (
      <FormStep stepConfig={stepConfig}>
        <ShortTextField name="birthplaceCity" label="City" />
        <ComboBoxField
          name="birthplaceCountry"
          label="Country"
          placeholder="Select a country"
          options={Object.entries(COUNTRIES).map(([value, label]) => ({
            label,
            value,
          }))}
        />
        {stateVisible && (
          <ComboBoxField
            name="birthplaceState"
            label="State"
            placeholder="Select a state"
            options={Object.entries(JURISDICTIONS).map(([value, label]) => ({
              label,
              value,
            }))}
          />
        )}
      </FormStep>
    );
  },
};
