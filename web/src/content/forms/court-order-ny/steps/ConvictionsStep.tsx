import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "#components/forms/FormStep";
import { LongTextField } from "#components/forms/LongTextField";
import { ShortTextField } from "#components/forms/ShortTextField";
import { YesNoField } from "#components/forms/YesNoField";
import { defineStep } from "#lib/forms/defineStep";
import { requestsNameChange } from "../conditions";

export const convictionsStep = defineStep({
  id: "convictions",
  title: "Have you ever been convicted of a crime?",
  when: requestsNameChange,
  fields: [
    "hasBeenConvictedOfCrime",
    {
      ids: ["courtOfConviction", "crime"],
      when: (data) => data.hasBeenConvictedOfCrime === true,
    },
  ],
  component: ({ stepConfig }) => {
    const detailsVisible = useFieldVisible(stepConfig, "crime");
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="hasBeenConvictedOfCrime"
          label="Have you ever been convicted of a crime?"
        />
        <FormSubsection isVisible={detailsVisible}>
          <ShortTextField
            name="courtOfConviction"
            label="Court where you were convicted"
          />
          <LongTextField
            name="crime"
            label="Crime for which you were convicted"
          />
        </FormSubsection>
      </FormStep>
    );
  },
});
