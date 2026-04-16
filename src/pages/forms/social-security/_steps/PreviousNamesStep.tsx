import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "../../../../components/forms/FormStep";
import { LongTextField } from "../../../../components/forms/LongTextField";
import { YesNoField } from "../../../../components/forms/YesNoField";
import type { Step } from "../../../../forms/types";

export const previousNamesStep: Step = {
  id: "previous-names",
  title: "Have you used any other legal names?",
  fields: [
    "hasOtherLegalNames",
    {
      id: "previousLegalNames",
      when: (data) => data.hasOtherLegalNames === true,
    },
  ],
  component: ({ stepConfig }) => {
    const previousNamesVisible = useFieldVisible(
      stepConfig,
      "previousLegalNames",
    );
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="hasOtherLegalNames"
          label="Have you used any other legal names?"
          labelHidden
          yesLabel="Yes"
          noLabel="No, I've never changed my name before"
        />
        <FormSubsection isVisible={previousNamesVisible}>
          <LongTextField name="previousLegalNames" label="Other names used" />
        </FormSubsection>
      </FormStep>
    );
  },
};
