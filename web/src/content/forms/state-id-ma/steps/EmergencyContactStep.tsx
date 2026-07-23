import { EmailField } from "#components/forms/EmailField";
import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "#components/forms/FormStep";
import { PhoneField } from "#components/forms/PhoneField";
import { RadioGroupField } from "#components/forms/RadioGroupField";
import { ShortTextField } from "#components/forms/ShortTextField";
import { YesNoField } from "#components/forms/YesNoField";
import { defineStep } from "#lib/forms/defineStep";

const whenEmergencyContact = (data: Record<string, unknown>) =>
  data.hasEmergencyContact === true;

export const emergencyContactStep = defineStep({
  id: "emergency-contact",
  title: "Would you like to include an emergency contact?",
  description: "This section of the RMV application is optional.",
  fields: [
    "hasEmergencyContact",
    {
      ids: [
        "emergencyContactName",
        "emergencyContactEmail",
        "emergencyContactPhoneType",
        "emergencyContactPhoneNumber",
      ],
      when: whenEmergencyContact,
    },
  ],
  component: ({ stepConfig }) => {
    const detailsVisible = useFieldVisible(stepConfig, "emergencyContactName");

    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="hasEmergencyContact"
          label="Include an emergency contact?"
          labelHidden
        />
        <FormSubsection
          title="Emergency contact information"
          isVisible={detailsVisible}
        >
          <ShortTextField
            name="emergencyContactName"
            label="Full name"
            size={30}
          />
          <EmailField name="emergencyContactEmail" label="Email address" />
          <RadioGroupField
            name="emergencyContactPhoneType"
            label="Phone type"
            options={[
              { label: "Cell", value: "cell" },
              { label: "Home", value: "home" },
              { label: "Work", value: "work" },
            ]}
          />
          <PhoneField name="emergencyContactPhoneNumber" label="Phone number" />
        </FormSubsection>
      </FormStep>
    );
  },
});
