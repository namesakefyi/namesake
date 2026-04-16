import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "../../../../components/forms/FormStep";
import { LongTextField } from "../../../../components/forms/LongTextField";
import { ShortTextField } from "../../../../components/forms/ShortTextField";
import { YesNoField } from "../../../../components/forms/YesNoField";
import { nameOrFallback } from "../../../../forms/resolveStepContent";
import type { Step } from "../../../../forms/types";

export const previousNameChangeStep: Step = {
  id: "previous-name-change",
  title: (data) =>
    `Has ${nameOrFallback(data, "the minor")} ever changed their legal name before?`,
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
          label="Has the child ever changed their legal name before?"
          labelHidden
        />
        <FormSubsection
          title="Please list the minor's past legal name."
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
