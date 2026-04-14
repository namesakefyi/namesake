import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "../../../../components/forms/FormStep";
import { PronounSelectField } from "../../../../components/forms/PronounSelectField";
import { YesNoField } from "../../../../components/forms/YesNoField";
import type { Step } from "../../../../forms/types";

export const pronounsStep: Step = {
  id: "pronouns",
  title: "Do you want to share your pronouns with the court staff?",
  fields: [
    "isOkayToSharePronouns",
    { id: "pronouns", when: (data) => data.isOkayToSharePronouns === true },
    {
      id: "otherPronouns",
      when: (data) => data.pronouns?.includes("other") === true,
    },
  ],
  component: ({ stepConfig }) => {
    const pronounsVisible = useFieldVisible(stepConfig, "pronouns");
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="isOkayToSharePronouns"
          label="Share my pronouns with the court staff?"
          labelHidden
        />
        <FormSubsection isVisible={pronounsVisible}>
          <PronounSelectField />
        </FormSubsection>
      </FormStep>
    );
  },
};
