import { Banner } from "#components/common/Banner";
import { AddressField } from "#components/forms/AddressField";
import { CheckboxField } from "#components/forms/CheckboxField";
import { FormStep, useFieldVisible } from "#components/forms/FormStep";
import { defineStep } from "#lib/forms/defineStep";

const whenNotUnhoused = (data: Record<string, unknown>) =>
  data.isCurrentlyUnhoused !== true;

export const addressStep = defineStep({
  id: "address",
  title: "What is your residential address?",
  fields: [
    "isCurrentlyUnhoused",
    {
      ids: [
        "residenceStreetAddress",
        "residenceCity",
        "residenceCounty",
        "residenceState",
        "residenceZipCode",
        "isMailingAddressDifferentFromResidence",
      ],
      when: whenNotUnhoused,
    },
  ],
  component: ({ stepConfig }) => {
    const residenceVisible = useFieldVisible(
      stepConfig,
      "residenceStreetAddress",
    );
    return (
      <FormStep stepConfig={stepConfig}>
        <CheckboxField
          name="isCurrentlyUnhoused"
          label="I am currently unhoused or without permanent housing"
        />
        {!residenceVisible && (
          <Banner variant="info">
            We recommend reaching out to the{" "}
            <a href="https://www.masstpc.org/homelessness/">
              Massachusetts Transgender Political Coalition
            </a>
            . MTPC can provide an address to use for your name change
            application and connect you with housing resources.
          </Banner>
        )}
        {residenceVisible && <AddressField type="residence" />}
      </FormStep>
    );
  },
});
