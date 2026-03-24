import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "@/components/react/forms/FormStep";
import { NameField } from "@/components/react/forms/NameField";
import { YesNoField } from "@/components/react/forms/YesNoField";
import type { Step } from "@/forms/types";

export const previousSocialSecurityCardStep: Step = {
  id: "previous-social-security-card",
  title: "Do you have a previous Social Security card?",
  description:
    "Or, have you ever filed for a Social Security number in the past?",
  fields: [
    "hasPreviousSocialSecurityCard",
    {
      ids: [
        "previousSocialSecurityCardFirstName",
        "previousSocialSecurityCardMiddleName",
        "previousSocialSecurityCardLastName",
      ],
      when: (data) => data.hasPreviousSocialSecurityCard === true,
    },
  ],
  component: ({ stepConfig }) => {
    const previousCardVisible = useFieldVisible(
      stepConfig,
      "previousSocialSecurityCardFirstName",
    );
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="hasPreviousSocialSecurityCard"
          label="Have you ever filed for or received a Social Security number card before?"
          labelHidden
          yesLabel="Yes, I have a previous Social Security card or have applied for one"
          noLabel="No, I have never filed for or received a Social Security card before"
        />
        <FormSubsection
          title="What is the name shown on your most recent Social Security card?"
          isVisible={previousCardVisible}
        >
          <NameField type="previousSocialSecurityCardName" />
        </FormSubsection>
      </FormStep>
    );
  },
};
