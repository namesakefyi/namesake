import { useFormContext } from "react-hook-form";
import { Banner } from "#components/common/Banner";
import { AddressField } from "#components/forms/AddressField";
import { CheckboxField } from "#components/forms/CheckboxField";
import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "#components/forms/FormStep";
import { defineStep } from "#lib/forms/defineStep";

const whenMailing = (data: Record<string, unknown>) =>
  data.isMailingAddressDifferentFromResidence === true;

export const addressStep = defineStep({
  id: "address",
  title: "What is your residential address?",
  description: "Enter the address where you currently live.",
  fields: [
    "isCurrentlyUnhoused",
    "residenceStreetAddress",
    "residenceStreetAddress2",
    "residenceCity",
    "residenceState",
    "residenceZipCode",
    "isMailingAddressDifferentFromResidence",
    {
      ids: [
        "mailingStreetAddress",
        "mailingStreetAddress2",
        "mailingCity",
        "mailingState",
        "mailingZipCode",
      ],
      when: whenMailing,
    },
  ],
  component: ({ stepConfig }) => {
    const { watch } = useFormContext();
    const isCurrentlyUnhoused = watch("isCurrentlyUnhoused") === true;
    const mailingVisible = useFieldVisible(stepConfig, "mailingStreetAddress");

    return (
      <FormStep stepConfig={stepConfig}>
        <CheckboxField
          name="isCurrentlyUnhoused"
          label="I am currently unhoused or without permanent housing"
        />
        {isCurrentlyUnhoused && (
          <Banner variant="info">
            If you are staying at a shelter or hospital, enter the facility's
            address below. For proof of residency, bring an original letter from
            the facility that includes your full name, date of birth, admission
            date, and says you need an ID to obtain housing.
          </Banner>
        )}
        <AddressField type="residence" includeAddress2 />
        <CheckboxField
          name="isMailingAddressDifferentFromResidence"
          label="I use a different mailing address"
        />
        <FormSubsection
          title="What is your mailing address?"
          isVisible={mailingVisible}
        >
          <AddressField type="mailing" includeAddress2 />
        </FormSubsection>
      </FormStep>
    );
  },
});
