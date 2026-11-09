import { ComboBoxField } from "#components/forms/ComboBoxField";
import { FormStep, useFieldVisible } from "#components/forms/FormStep";
import { ShortTextField } from "#components/forms/ShortTextField";
import { COUNTRY_OPTIONS } from "#constants/countries";
import { JURISDICTION_OPTIONS } from "#constants/jurisdictions";
import { defineStep } from "#lib/forms/defineStep";
import { requestsNameChange } from "../conditions";

export const birthplaceStep = defineStep({
  id: "birthplace",
  title: "Where were you born?",
  when: requestsNameChange,
  fields: [
    "birthplaceCity",
    "birthplaceCountry",
    { id: "birthplaceState", when: (data) => data.birthplaceCountry === "US" },
    {
      id: "birthplaceRegion",
      when: (data) =>
        !!data.birthplaceCountry && data.birthplaceCountry !== "US",
    },
  ],
  component: ({ stepConfig }) => {
    const stateVisible = useFieldVisible(stepConfig, "birthplaceState");
    const regionVisible = useFieldVisible(stepConfig, "birthplaceRegion");
    return (
      <FormStep stepConfig={stepConfig}>
        <ShortTextField name="birthplaceCity" label="City, town, or village" />
        <ComboBoxField
          name="birthplaceCountry"
          label="Country"
          placeholder="Select a country"
          options={COUNTRY_OPTIONS}
        />
        {stateVisible && (
          <ComboBoxField
            name="birthplaceState"
            label="State"
            placeholder="Select a state"
            options={JURISDICTION_OPTIONS}
          />
        )}
        {regionVisible && (
          <ShortTextField name="birthplaceRegion" label="Province or region" />
        )}
      </FormStep>
    );
  },
});
