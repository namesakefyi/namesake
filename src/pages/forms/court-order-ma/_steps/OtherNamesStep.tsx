import { Banner } from "../../../../components/common/Banner";
import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "../../../../components/forms/FormStep";
import { LongTextField } from "../../../../components/forms/LongTextField";
import { YesNoField } from "../../../../components/forms/YesNoField";
import type { Step } from "../../../../forms/types";

export const otherNamesStep: Step = {
  id: "other-names",
  title: "Have you ever used any other name or alias?",
  description:
    "This includes any names that you have used over a long period of time but did not change legally.",
  fields: [
    "hasUsedOtherNameOrAlias",
    {
      id: "otherNamesOrAliases",
      when: (data) => data.hasUsedOtherNameOrAlias === true,
    },
  ],
  component: ({ stepConfig }) => {
    const otherNamesVisible = useFieldVisible(
      stepConfig,
      "otherNamesOrAliases",
    );
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="hasUsedOtherNameOrAlias"
          label="Have you ever used any other name or alias?"
          labelHidden
          yesLabel="Yes, I've used other names"
          noLabel="No, there are no other major names I've used"
        />
        <Banner variant="info">
          This does not include nicknames or other names you've used for short
          periods of time.
        </Banner>
        <FormSubsection
          title="Please list all names you haven't previously listed."
          isVisible={otherNamesVisible}
        >
          <LongTextField
            name="otherNamesOrAliases"
            label="Other names or aliases"
          />
        </FormSubsection>
      </FormStep>
    );
  },
};
