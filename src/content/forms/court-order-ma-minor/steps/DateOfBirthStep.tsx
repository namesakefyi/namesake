import { useFormContext } from "react-hook-form";
import { Banner } from "../../../../components/common/Banner";
import { FormStep } from "../../../../components/forms/FormStep";
import { MemorableDateField } from "../../../../components/forms/MemorableDateField";
import { nameOrFallback } from "../../../../forms/resolveStepContent";
import type { Step } from "../../../../forms/types";
import { deriveCurrentAge } from "../../../../utils/deriveCurrentAge";

export const dateOfBirthStep: Step = {
  id: "date-of-birth",
  title: (data) =>
    `What is ${nameOrFallback(data, "the minor")}'s date of birth?`,
  fields: ["dateOfBirth"],
  component: ({ stepConfig }) => {
    const form = useFormContext();
    const age = deriveCurrentAge(form.watch("dateOfBirth"));
    const isAtLeast12 = age !== undefined && age >= 12;
    const isOver18 = age !== undefined && age >= 18;

    return (
      <FormStep stepConfig={stepConfig}>
        <MemorableDateField name="dateOfBirth" label="Date of birth" />
        {isOver18 && (
          <Banner variant="warning">
            The petitioner is over 18 years of age. Submit the{" "}
            <a href="/forms/court-order-ma">adult court order</a> instead.
          </Banner>
        )}
        {isAtLeast12 && !isOver18 && (
          <Banner>
            Since the minor is 12 years of age or older,{" "}
            <strong>
              the child's written notarized assent must be obtained before
              filing this petition
            </strong>
            . You will fill this out after downloading and printing the final
            packet.
          </Banner>
        )}
      </FormStep>
    );
  },
};
