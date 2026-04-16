import { useFormContext } from "react-hook-form";
import { Banner } from "../../../../components/common/Banner";
import { FormStep } from "../../../../components/forms/FormStep";
import { YesNoField } from "../../../../components/forms/YesNoField";
import type { Step } from "../../../../forms/types";

export const returnDocumentsStep: Step = {
  id: "return-documents",
  title: "Do you want your original documents returned afterwards?",
  fields: ["shouldReturnOriginalDocuments"],
  component: ({ stepConfig }) => {
    const form = useFormContext();
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="shouldReturnOriginalDocuments"
          label="Return original documents?"
          labelHidden
          yesLabel="Yes, return my documents"
          noLabel="No, I don't need my documents returned"
        />
        {form.watch("shouldReturnOriginalDocuments") === false && (
          <Banner variant="warning">
            We strongly recommend getting your original documents back from the
            court.
          </Banner>
        )}
      </FormStep>
    );
  },
};
