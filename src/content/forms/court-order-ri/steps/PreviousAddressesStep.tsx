import { TextField } from "#components/common/TextField";
import { FormStep } from "#components/forms/FormStep";
import { RepeatingEntry } from "#components/forms/RepeatingEntry";
import { defineStep } from "#forms/defineStep";

export const previousAddressesStep = defineStep({
  id: "previous-addresses",
  title: "What are your most recent addresses?",
  description:
    "List up to three addresses where you have resided prior to your current address.",
  fields: [
    {
      id: "previousAddresses",
      when: (data) => data.previousAddresses?.some(Boolean) ?? false,
    },
  ],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <RepeatingEntry name="previousAddresses" min={0} max={3} defaultCount={1}>
        {(value, onChange, index) => (
          <TextField
            value={value}
            onChange={onChange}
            label={`Address ${index + 1}`}
            size={40}
          />
        )}
      </RepeatingEntry>
    </FormStep>
  ),
});
