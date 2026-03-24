import { useFormContext } from "react-hook-form";
import { Banner } from "@/components/react/common/Banner";
import { FormStep } from "@/components/react/forms/FormStep";
import { YesNoField } from "@/components/react/forms/YesNoField";
import { nameOrFallback } from "@/forms/resolveStepContent";
import type { Step } from "@/forms/types";

export const parentsDeceasedStep: Step = {
  id: "parent-deceased",
  title: (data) =>
    `Are any of ${nameOrFallback(data, "the minor")}'s legal parents deceased?`,
  fields: ["isALegalParentDeceased"],
  component: ({ stepConfig }) => {
    const form = useFormContext();

    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="isALegalParentDeceased"
          label="Are any of the minor's parents deceased?"
          labelHidden
          yesLabel="Yes, one or more parents have died"
          noLabel="No, both parents are living"
        />
        {form.watch("isALegalParentDeceased") === true && (
          <Banner>
            We're sorry for your loss. When filing, the court requests that you
            attach a copy of the death certificate to your application.
          </Banner>
        )}
      </FormStep>
    );
  },
};
