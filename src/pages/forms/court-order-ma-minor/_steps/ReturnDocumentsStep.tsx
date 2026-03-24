import { useFormContext } from "react-hook-form";
import { Banner } from "@/components/react/common/Banner";
import { FormStep } from "@/components/react/forms/FormStep";
import { YesNoField } from "@/components/react/forms/YesNoField";
import type { Step } from "@/forms/types";

export const returnDocumentsStep: Step = {
  id: "return-documents",
  title: "Do you want all original documents returned afterwards?",
  fields: ["shouldReturnOriginalDocuments"],
  component: ({ stepConfig }) => {
    const form = useFormContext();
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="shouldReturnOriginalDocuments"
          label="Return original documents?"
          labelHidden
          yesLabel="Yes, return all original documents"
          noLabel="No, I don't need the documents returned"
        />
        {form.watch("shouldReturnOriginalDocuments") === false && (
          <Banner variant="warning">
            We strongly recommend getting original documents back from the
            court.
          </Banner>
        )}
      </FormStep>
    );
  },
};
