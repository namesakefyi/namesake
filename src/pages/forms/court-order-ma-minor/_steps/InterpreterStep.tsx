import { CheckboxField } from "@/components/react/forms/CheckboxField";
import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "@/components/react/forms/FormStep";
import { LanguageSelectField } from "@/components/react/forms/LanguageSelectField";
import type { Step } from "@/forms/types";

export const interpreterStep: Step = {
  id: "interpreter",
  title: "If there is a hearing, does anyone need an interpreter?",
  description: "In most cases, a hearing is not required.",
  fields: [
    "isInterpreterNeededForChild",
    "isInterpreterNeededForParent1",
    "isInterpreterNeededForParent2",
    "isInterpreterNeededForGuardian",
    {
      id: "language",
      when: (data) =>
        data.isInterpreterNeededForChild === true ||
        data.isInterpreterNeededForParent1 === true ||
        data.isInterpreterNeededForParent2 === true ||
        data.isInterpreterNeededForGuardian === true,
    },
  ],
  component: ({ stepConfig }) => {
    const languageVisible = useFieldVisible(stepConfig, "language");
    return (
      <FormStep stepConfig={stepConfig}>
        <CheckboxField
          name="isInterpreterNeededForChild"
          label="The child needs an interpreter"
        />
        <CheckboxField
          name="isInterpreterNeededForParent1"
          label="Parent 1 needs an interpreter"
        />
        <CheckboxField
          name="isInterpreterNeededForParent2"
          label="Parent 2 needs an interpreter"
        />
        <CheckboxField
          name="isInterpreterNeededForGuardian"
          label="A guardian needs an interpreter"
        />
        <FormSubsection isVisible={languageVisible}>
          <LanguageSelectField name="language" />
        </FormSubsection>
      </FormStep>
    );
  },
};
