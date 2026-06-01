import { useFormContext } from "react-hook-form";
import { Banner } from "../../../components/common/Banner";
import { FormStep } from "../../../components/forms/FormStep";
import { YesNoField } from "../../../components/forms/YesNoField";
import type { Step } from "../../../forms/types";

export const previousNameChangeStep: Step = {
  id: "previous-name-change",
  title: "Have you ever changed your name before?",
  fields: ["hasPreviousNameChange"],
  component: ({ stepConfig }) => {
    const { watch } = useFormContext();
    const hasPreviousNameChange = watch("hasPreviousNameChange");
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="hasPreviousNameChange"
          label="Have you ever changed your name before?"
          labelHidden
          yesLabel="Yes, I've changed my name before"
          noLabel="No, I've never changed my name"
        />
        {hasPreviousNameChange === true && (
          <Banner variant="info">
            Attach a copy of each prior court order or marriage license to your
            petition.
          </Banner>
        )}
      </FormStep>
    );
  },
};
