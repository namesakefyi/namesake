import { FormStep } from "#components/forms/FormStep";
import { ShortTextField } from "#components/forms/ShortTextField";
import { defineStep } from "#lib/forms/defineStep";
import { deriveCurrentAge } from "#lib/utils/deriveCurrentAge";

export const guardianAuthorizationStep = defineStep({
  id: "guardian-authorization-step",
  title: "Parent or guardian authorization",
  description:
    "At least one parent or guardian must authorize this change if you are under 18 years old.",
  fields: ["guardianOneFullName", "guardianTwoFullName"],
  when(data) {
    const age = deriveCurrentAge(data.dateOfBirth);
    return age == null || age < 18;
  },
  component: ({ stepConfig }) => {
    return (
      <FormStep stepConfig={stepConfig}>
        <ShortTextField
          label="Parent or guardian 1's full name"
          name="guardianOneFullName"
          size={24}
          isRequired
        />
        <ShortTextField
          label="Parent or guardian 2's full name (optional)"
          name="guardianTwoFullName"
          size={24}
        />
      </FormStep>
    );
  },
});
