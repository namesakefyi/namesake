import { AddressField } from "#components/forms/AddressField";
import { FormStep } from "#components/forms/FormStep";
import { NEW_YORK_COUNTY_OPTIONS } from "#constants/newYorkCounties";
import { defineStep } from "#lib/forms/defineStep";

export const addressStep = defineStep({
  id: "address",
  title: "What is your current address?",
  fields: [
    "residenceStreetAddress",
    "residenceStreetAddress2",
    "residenceCity",
    "residenceState",
    "residenceZipCode",
    "residenceCounty",
  ],
  component: ({ stepConfig }) => {
    return (
      <FormStep stepConfig={stepConfig}>
        <AddressField
          type="residence"
          includeAddress2
          includeCounty
          countyOptions={NEW_YORK_COUNTY_OPTIONS}
        />
      </FormStep>
    );
  },
});
