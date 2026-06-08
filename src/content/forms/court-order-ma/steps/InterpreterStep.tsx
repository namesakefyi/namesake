import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "../../../../components/forms/FormStep";
import { LanguageSelectField } from "../../../../components/forms/LanguageSelectField";
import { YesNoField } from "../../../../components/forms/YesNoField";
import type { Step } from "../../../../forms/types";

export const interpreterStep: Step = {
  id: "interpreter",
  title:
    "If there is a hearing for your name change, do you need an interpreter?",
  description: "In most cases, a hearing is not required.",
  fields: [
    "isInterpreterNeeded",
    { id: "language", when: (data) => data.isInterpreterNeeded === true },
  ],
  component: ({ stepConfig }) => {
    const languageVisible = useFieldVisible(stepConfig, "language");
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="isInterpreterNeeded"
          label="If there is a hearing for your name change, do you need an interpreter?"
          labelHidden
          yesLabel="Yes, I need an interpreter"
          noLabel="No, I don't need an interpreter"
        />
        <FormSubsection isVisible={languageVisible}>
          <LanguageSelectField name="language" />
        </FormSubsection>
      </FormStep>
    );
  },
};
