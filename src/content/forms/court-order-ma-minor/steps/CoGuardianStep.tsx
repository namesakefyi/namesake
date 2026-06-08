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

export const coGuardianStep: Step = {
  id: "co-guardian",
  title: (data) =>
    `Does ${nameOrFallback(data, "the minor")} have a court-appointed co-guardian?`,
  when: (data) => data.hasCourtAppointedGuardian === true,
  fields: [
    "hasCourtAppointedCoGuardian",
    {
      ids: [
        "coGuardianFullName",
        "coGuardianStreetAddress",
        "coGuardianCity",
        "coGuardianState",
        "coGuardianZipCode",
        "coGuardianPhone",
        "coGuardianEmail",
      ],
      when: (data) => data.hasCourtAppointedCoGuardian === true,
    },
  ],
  component: ({ stepConfig }) => {
    const coGuardianVisible = useFieldVisible(stepConfig, "coGuardianFullName");
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="hasCourtAppointedCoGuardian"
          label="Is there a court-appointed co-guardian?"
          labelHidden
          yesLabel="Yes"
          noLabel="No"
        />
        <FormSubsection
          title="Co-guardian information"
          isVisible={coGuardianVisible}
        >
          <ShortTextField
            name="coGuardianFullName"
            label="Co-guardian full name"
          />
          <ShortTextField
            name="coGuardianStreetAddress"
            label="Street address"
          />
          <ShortTextField name="coGuardianCity" label="City" />
          <CoGuardianStateField />
          <ShortTextField name="coGuardianZipCode" label="ZIP code" />
          <PhoneField name="coGuardianPhone" />
          <EmailField name="coGuardianEmail" />
        </FormSubsection>
      </FormStep>
    );
  },
};

function CoGuardianStateField() {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name="coGuardianState"
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
