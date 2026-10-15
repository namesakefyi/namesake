import { ComboBoxField } from "#components/forms/ComboBoxField";
import { FormStep, useFieldVisible } from "#components/forms/FormStep";
import { ShortTextField } from "#components/forms/ShortTextField";
import { COUNTRIES } from "#constants/countries";
import { JURISDICTION_OPTIONS } from "#constants/jurisdictions";
import { defineStep } from "#lib/forms/defineStep";
import { requestsNameChange } from "../conditions";

export const birthplaceStep = defineStep({
  id: "birthplace",
  title: "Where were you born?",
  when: requestsNameChange,
  fields: [
    "birthplaceStreetAddress",
    "birthplaceCity",
    { id: "birthplaceState", when: (data) => data.birthplaceCountry === "US" },
    {
      id: "birthplaceRegion",
      when: (data) =>
        !!data.birthplaceCountry && data.birthplaceCountry !== "US",
    },
    "birthplaceZipCode",
    "birthplaceCountry",
  ],
  component: ({ stepConfig }) => {
    const stateVisible = useFieldVisible(stepConfig, "birthplaceState");
    const regionVisible = useFieldVisible(stepConfig, "birthplaceRegion");
    return (
      <FormStep stepConfig={stepConfig}>
        <ShortTextField name="birthplaceStreetAddress" label="Street address" />
        <ShortTextField name="birthplaceCity" label="City, town, or village" />
        <ShortTextField name="birthplaceZipCode" label="ZIP or postal code" />
        <ComboBoxField
          name="birthplaceCountry"
          label="Country"
          placeholder="Select a country"
          options={Object.entries(COUNTRIES).map(([value, label]) => ({
            value,
            label,
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
        {regionVisible && (
          <ShortTextField name="birthplaceRegion" label="Province or region" />
        )}
      </FormStep>
    );
  },
});
