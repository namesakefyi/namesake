import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "#components/forms/FormStep";
import { LongTextField } from "#components/forms/LongTextField";
import { YesNoField } from "#components/forms/YesNoField";
import { defineStep } from "#lib/forms/defineStep";
import { requestsNameChange } from "../conditions";

export const previousNamePetitionStep = defineStep({
  id: "previous-name-petition",
  title: "Have you ever filed a name change petition before?",
  when: requestsNameChange,
  fields: [
    "hasPreviouslyFiledNameChange",
    {
      id: "previousNameChangePetitionDetails",
      when: (data) => data.hasPreviouslyFiledNameChange === true,
    },
  ],
  component: ({ stepConfig }) => {
    const detailsVisible = useFieldVisible(
      stepConfig,
      "previousNameChangePetitionDetails",
    );
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="hasPreviouslyFiledNameChange"
          label="Have you ever filed a name change petition before?"
        />
        <FormSubsection isVisible={detailsVisible}>
          <LongTextField
            name="previousNameChangePetitionDetails"
            label="Previous petition details"
            description="Include the court, filing date, case number if known, and result."
          />
        </FormSubsection>
      </FormStep>
    );
  },
});
