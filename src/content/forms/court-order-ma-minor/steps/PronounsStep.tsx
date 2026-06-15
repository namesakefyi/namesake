import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "../../../../components/forms/FormStep";
import { PronounSelectField } from "../../../../components/forms/PronounSelectField";
import { YesNoField } from "../../../../components/forms/YesNoField";
import { defineStep } from "../../../../forms/defineStep";
import { nameOrFallback } from "../../../../forms/resolveStepContent";

export const pronounsStep = defineStep({
  id: "pronouns",
  title: (data) =>
    `Do you want to share ${nameOrFallback(data, "the minor")}'s pronouns with the court staff?`,
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
          label="Share the child's pronouns with the court staff?"
          labelHidden
        />
        <FormSubsection isVisible={pronounsVisible}>
          <PronounSelectField />
        </FormSubsection>
      </FormStep>
    );
  },
});
