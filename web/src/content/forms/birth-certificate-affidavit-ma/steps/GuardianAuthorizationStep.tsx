import { FormStep } from "#components/forms/FormStep";
import { ShortTextField } from "#components/forms/ShortTextField";
import { defineStep } from "#lib/forms/defineStep";
import { deriveCurrentAge } from "#lib/utils/deriveCurrentAge";

export const guardianAuthorizationStep = defineStep({
  id: "guardian-authorization-step",
  title: "Parent or guardian authorization",
  description:
    "Since you are under 18 years old, at least one parent or guardian must authorize this change.",
  fields: ["guardianOneFullName", "guardianTwoFullName"],
  when: (data) => deriveCurrentAge(data.dateOfBirth) < 18,
  component: ({ stepConfig }) => {
    return (
      <FormStep stepConfig={stepConfig}>
        <ShortTextField
          label="Parent or guardian 1's full name"
          name="guardianOneFullName"
          size={24}
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
