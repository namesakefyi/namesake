import { useFormContext } from "react-hook-form";
import { Banner } from "@/components/react/common/Banner";
import { FormStep } from "@/components/react/forms/FormStep";
import { YesNoField } from "@/components/react/forms/YesNoField";
import type { Step } from "@/forms/types";

export const parentalRightsTerminatedStep: Step = {
  id: "parental-rights-terminated",
  title: "Has either parent had their parental rights terminated?",
  fields: ["hasLegalParentHadParentalRightsTerminated"],
  component: ({ stepConfig }) => {
    const form = useFormContext();

    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="hasLegalParentHadParentalRightsTerminated"
          label="Has any legal parent listed on the minor's birth certificate had their parental rights terminated?"
          labelHidden
          yesLabel="Yes"
          noLabel="No"
        />
        {form.watch("hasLegalParentHadParentalRightsTerminated") === true && (
          <Banner>
            When filing, attach proof from the prior court proceeding.
          </Banner>
        )}
      </FormStep>
    );
  },
};
