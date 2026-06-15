import { useFormContext } from "react-hook-form";
import { Banner } from "~/components/common/Banner";
import { FormStep } from "~/components/forms/FormStep";
import { RadioGroupField } from "~/components/forms/RadioGroupField";
import { defineStep } from "~/forms/defineStep";

export const indigencyBasisStep = defineStep({
  id: "indigency-basis",
  title: "Why are you requesting a fee waiver?",
  fields: ["indigencyBasis"],
  component: ({ stepConfig }) => {
    const form = useFormContext();
    const noneOfTheAbove = form.watch("indigencyBasis") === "none";

    return (
      <FormStep stepConfig={stepConfig}>
        <RadioGroupField
          name="indigencyBasis"
          label="Reason for indigency"
          labelHidden
          options={[
            {
              label:
                "I receive public assistance (TAFDC, EAEDC, Veterans Benefits, Medicaid, or SSI)",
              value: "public-assistance",
            },
            {
              label: "My income is at or below the poverty level",
              value: "income",
            },
            {
              label:
                "I cannot pay without depriving myself or my dependents of food, shelter, or clothing",
              value: "unable-to-pay",
            },
            {
              label: "None of the above",
              value: "none",
            },
          ]}
        />
        {noneOfTheAbove && (
          <Banner variant="info">
            You may be able to get help covering filing fees through the{" "}
            <a
              href="https://www.masstpc.org/what-we-do/ida-network/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Massachusetts Transgender Political Coalition's Identity Document
              Assistance network
            </a>
            .
          </Banner>
        )}
      </FormStep>
    );
  },
});
