import { Banner } from "../../../../components/common/Banner";
import { AddressField } from "../../../../components/forms/AddressField";
import { CheckboxField } from "../../../../components/forms/CheckboxField";
import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "../../../../components/forms/FormStep";
import type { Step } from "../../../../forms/types";

const whenNotUnhoused = (data: Record<string, unknown>) =>
  data.isCurrentlyUnhoused !== true;

const whenMailing = (data: Record<string, unknown>) =>
  data.isCurrentlyUnhoused !== true &&
  data.isMailingAddressDifferentFromResidence === true;

export const addressStep: Step = {
  id: "address",
  title: "What is your residential address?",
  description:
    "You must file your name change with the Probate Court in the city or town where you live.",
  fields: [
    "isCurrentlyUnhoused",
    {
      ids: [
        "residenceStreetAddress",
        "residenceCity",
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
            We recommend reaching out to{" "}
            <a href="https://www.thundermisthealth.org/services/social-services/">
              Thundermist Health Center
            </a>
            , which has locations in Woonsocket, West Warwick, and Wakefield.
            Thundermist can help connect you with social services and may be
            able to provide an address to use for your name change application.
          </Banner>
        )}
        {residenceVisible && (
          <>
            <AddressField type="residence" />
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
