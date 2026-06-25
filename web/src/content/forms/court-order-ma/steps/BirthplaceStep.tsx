import { ComboBoxField } from "#components/forms/ComboBoxField";
import { FormStep, useFieldVisible } from "#components/forms/FormStep";
import { ShortTextField } from "#components/forms/ShortTextField";
import { COUNTRIES } from "#constants/countries";
import { JURISDICTION_OPTIONS } from "#constants/jurisdictions";
import { defineStep } from "#lib/forms/defineStep";

export const birthplaceStep = defineStep({
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
            options={JURISDICTION_OPTIONS}
          />
        )}
      </FormStep>
    );
  },
});
