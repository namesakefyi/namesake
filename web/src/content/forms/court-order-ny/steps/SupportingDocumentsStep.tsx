import {
  FormStep,
  FormSubsection,
  useFieldVisible,
} from "#components/forms/FormStep";
import { LongTextField } from "#components/forms/LongTextField";
import { YesNoField } from "#components/forms/YesNoField";
import { defineStep } from "#lib/forms/defineStep";

export const supportingDocumentsStep = defineStep({
  id: "supporting-documents",
  title: "Are you attaching supporting documents or additional pages?",
  fields: [
    "hasAttachedSupportingDocuments",
    {
      id: "supportingDocumentsDetails",
      when: (data) => data.hasAttachedSupportingDocuments === true,
    },
  ],
  component: ({ stepConfig }) => {
    const detailsVisible = useFieldVisible(
      stepConfig,
      "supportingDocumentsDetails",
    );
    return (
      <FormStep stepConfig={stepConfig}>
        <YesNoField
          name="hasAttachedSupportingDocuments"
          label="Are you attaching supporting documents or additional pages?"
        />
        <FormSubsection isVisible={detailsVisible}>
          <LongTextField
            name="supportingDocumentsDetails"
            label="Documents or additional pages"
            description="List the name or a description of each document."
          />
        </FormSubsection>
      </FormStep>
    );
  },
});
