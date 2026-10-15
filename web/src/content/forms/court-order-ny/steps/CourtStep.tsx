import { Banner } from "#components/common/Banner";
import { ComboBoxField } from "#components/forms/ComboBoxField";
import { FormStep } from "#components/forms/FormStep";
import { ShortTextField } from "#components/forms/ShortTextField";
import { NEW_YORK_COUNTY_OPTIONS } from "#constants/newYorkCounties";
import { defineStep } from "#lib/forms/defineStep";

export const courtStep = defineStep({
  id: "court",
  title: "Which court are you filing in?",
  fields: ["courtType", "courtCounty"],
  component: ({ stepConfig }) => {
    return (
      <FormStep stepConfig={stepConfig}>
        <Banner>
          <p>
            You can file your name change petition with the Supreme Court county
            clerk in the county where you live. If you live in New York City,
            you can also file in any NYC Civil Court, which has a lower filing
            fee.
          </p>
          <p>
            Use the{" "}
            <a href="https://www.nycourts.gov/court-locator">
              New York Courts court locator
            </a>{" "}
            to find a court near you.
          </p>
        </Banner>
        <ShortTextField name="courtType" label="Court" />
        <ComboBoxField
          name="courtCounty"
          label="County"
          placeholder="Select a county"
          options={NEW_YORK_COUNTY_OPTIONS}
        />
      </FormStep>
    );
  },
});
