import { useFormContext } from "react-hook-form";
import { Banner } from "#components/common/Banner";
import { FormStep } from "#components/forms/FormStep";
import { RadioGroupField } from "#components/forms/RadioGroupField";
import { defineStep } from "#lib/forms/defineStep";

export const newGenderStep = defineStep({
  id: "new-gender",
  title: "What is your new gender marker?",
  description:
    "This is the gender marker that will display on your amended birth certificate.",
  fields: ["newGender"],
  component: ({ stepConfig }) => {
    const { watch } = useFormContext();
    const [oldGender, newGender] = watch(["oldGender", "newGender"]);

    return (
      <FormStep stepConfig={stepConfig}>
        <RadioGroupField
          name="newGender"
          labelHidden
          label="Sex"
          options={[
            {
              label: "Female",
              value: "Female",
            },
            {
              label: "Male",
              value: "Male",
            },
            {
              label: "X",
              value: "X",
            },
          ]}
        />
        {oldGender != null && oldGender === newGender && (
          <Banner variant="warning">
            Your birth and new gender markers are identical. Massachusetts
            doesn't allow people to amend their birth certificate if their
            gender markers are unchanged.
          </Banner>
        )}
      </FormStep>
    );
  },
});
