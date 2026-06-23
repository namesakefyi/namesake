import { FormStep } from "#components/forms/FormStep";
import { ShortTextField } from "#components/forms/ShortTextField";
import { defineStep } from "#lib/forms/defineStep";

export const birthTownStep = defineStep({
  id: "birthplace",
  title: "Where were you born?",
  fields: ["birthplaceCity"],
  component: ({ stepConfig }) => {
    return (
      <FormStep stepConfig={stepConfig}>
        <ShortTextField name="birthplaceCity" label="City" />
      </FormStep>
    );
  },
});
