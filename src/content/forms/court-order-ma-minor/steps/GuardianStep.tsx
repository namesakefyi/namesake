import { Controller, useFormContext } from "react-hook-form";
import { ComboBox, ComboBoxItem } from "../../../../components/common/ComboBox";
import { EmailField } from "../../../../components/forms/EmailField";
import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "../../../../components/forms/FormStep";
import { PhoneField } from "../../../../components/forms/PhoneField";
import { ShortTextField } from "../../../../components/forms/ShortTextField";
import { YesNoField } from "../../../../components/forms/YesNoField";
import { JURISDICTIONS } from "../../../../constants/jurisdictions";
import { nameOrFallback } from "../../../../forms/resolveStepContent";
import type { Step } from "../../../../forms/types";

export const guardianStep: Step = {
  id: "guardian",
  title: (data) =>
    `Does ${nameOrFallback(data, "the minor")} have a court-appointed guardian?`,
  fields: [
    "hasCourtAppointedGuardian",
    {
      ids: [
        "guardianFullName",
        "guardianStreetAddress",
        "guardianCity",
        "guardianState",
        "guardianZipCode",
        "guardianPhone",
        "guardianEmail",
      ],
      when: (data) => data.hasCourtAppointedGuardian === true,
    },
  ],
  component: ({ stepConfig }) => {
    const guardianVisible = useFieldVisible(stepConfig, "guardianFullName");
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="hasCourtAppointedGuardian"
          label="Is there a court-appointed guardian?"
          labelHidden
          yesLabel="Yes"
          noLabel="No"
        />
        <FormSubsection
          title="Guardian information"
          isVisible={guardianVisible}
        >
          <ShortTextField name="guardianFullName" label="Guardian full name" />
          <ShortTextField name="guardianStreetAddress" label="Street address" />
          <ShortTextField name="guardianCity" label="City" />
          <GuardianStateField />
          <ShortTextField name="guardianZipCode" label="ZIP code" />
          <PhoneField name="guardianPhone" />
          <EmailField name="guardianEmail" />
        </FormSubsection>
      </FormStep>
    );
  },
};

function GuardianStateField() {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name="guardianState"
      defaultValue=""
      render={({ field, fieldState: { invalid, error } }) => (
        <ComboBox
          {...field}
          label="State"
          placeholder="Select state"
          value={field.value}
          onChange={field.onChange}
          isInvalid={invalid}
          errorMessage={error?.message}
          menuTrigger="focus"
        >
          {Object.entries(JURISDICTIONS).map(([value, label]) => (
            <ComboBoxItem key={value} id={value}>
              {label}
            </ComboBoxItem>
          ))}
        </ComboBox>
      )}
    />
  );
}
