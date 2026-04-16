import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "../../../../components/forms/FormStep";
import { LongTextField } from "../../../../components/forms/LongTextField";
import { ShortTextField } from "../../../../components/forms/ShortTextField";
import { YesNoField } from "../../../../components/forms/YesNoField";
import type { Step } from "../../../../forms/types";

export const previousNameChangeStep: Step = {
  id: "previous-name-change",
  title: "Have you ever changed your name before?",
  fields: [
    "hasPreviousNameChange",
    {
      ids: ["previousNameFrom", "previousNameTo", "previousNameReason"],
      when: (data) => data.hasPreviousNameChange === true,
    },
  ],
  component: ({ stepConfig }) => {
    const previousNameVisible = useFieldVisible(stepConfig, "previousNameFrom");
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="hasPreviousNameChange"
          label="Have you ever changed your name before?"
          labelHidden
          yesLabel="Yes, I've changed my name"
          noLabel="No, I've never changed my name"
        />
        <FormSubsection
          title="Please list your past legal name."
          isVisible={previousNameVisible}
        >
          <ShortTextField name="previousNameFrom" label="From" />
          <ShortTextField name="previousNameTo" label="To" />
          <LongTextField name="previousNameReason" label="Reason for change" />
        </FormSubsection>
      </FormStep>
    );
  },
};
