import { Banner } from "@/components/react/common/Banner";
import { AddressField } from "@/components/react/forms/AddressField";
import { CheckboxField } from "@/components/react/forms/CheckboxField";
import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "@/components/react/forms/FormStep";
import type { Step } from "@/forms/types";

const whenNotUnhoused = (data: Record<string, unknown>) =>
  data.isCurrentlyUnhoused !== true;

const whenMailing = (data: Record<string, unknown>) =>
  data.isCurrentlyUnhoused !== true &&
  data.isMailingAddressDifferentFromResidence === true;

export const addressStep: Step = {
  id: "address",
  title: "What is your residential address?",
  description:
    "You must file your name change in the county where you live. We'll help you find where to file.",
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
    {
      ids: [
        "mailingStreetAddress",
        "mailingCity",
        "mailingCounty",
        "mailingState",
        "mailingZipCode",
      ],
      when: whenMailing,
    },
  ],
  component: ({ stepConfig }) => {
    const residenceVisible = useFieldVisible(
      stepConfig,
      "residenceStreetAddress",
    );
    const mailingVisible = useFieldVisible(stepConfig, "mailingStreetAddress");
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
        {residenceVisible && (
          <>
            <AddressField type="residence" includeCounty />
            <CheckboxField
              name="isMailingAddressDifferentFromResidence"
              label="I use a different mailing address"
            />
          </>
        )}
        <FormSubsection
          title="What is your mailing address?"
          isVisible={mailingVisible}
        >
          <AddressField type="mailing" />
        </FormSubsection>
      </FormStep>
    );
  },
};
