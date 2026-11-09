import { useFormContext } from "react-hook-form";
import type { FormData } from "#constants/fields";
import { resolveFormVisibility } from "#lib/forms/formVisibility";
import { getStepFields, type StepField } from "#lib/forms/getStepFields";
import { resolveText } from "#lib/forms/resolveStepContent";
import type { Step } from "#lib/forms/types";
import { formatFieldValue } from "#lib/utils/formatReviewFields";
import { useFormStep } from "../FormContainer/FormStepContext";
import "./FormReviewTable.css";
import { smartquotes } from "#lib/utils/smartquotes";

export interface FormReviewTableProps {
  steps: readonly Step[];
}

interface ReviewField {
  fieldName: string;
  label: string;
  value: string | undefined;
}

interface ReviewSection {
  stepId: string;
  fields: ReviewField[];
}

export function FormReviewTable({ steps }: FormReviewTableProps) {
  const form = useFormContext();
  const { onEditStep } = useFormStep();
  const formData = form.getValues() as FormData;

  const { sections } = resolveFormVisibility(steps, formData);

  const stepsById = new Map(steps.map((step) => [step.id, step]));
  const reviewSections: ReviewSection[] = sections
    .filter(({ fields }) => fields.length > 0)
    .map(({ stepId, fields }) => {
      const step = stepsById.get(stepId) as Step;
      const stepFields = new Map(
        getStepFields(step).map((field) => [field.id, field]),
      );
      return {
        stepId,
        fields: fields.map((fieldName) => {
          const stepField = stepFields.get(fieldName) as StepField;
          return {
            fieldName,
            label: smartquotes(resolveText(stepField.reviewLabel, formData)),
            value: formatFieldValue(fieldName, formData[fieldName], {
              options: stepField.options,
              currency: stepField.currency,
            }),
          };
        }),
      };
    });

  return (
    <div className="form-review-sections">
      {reviewSections.map((section) => (
        <section key={section.stepId} className="form-review-section">
          <dl className="form-review-list">
            {section.fields.map((field) => (
              <div key={field.fieldName} className="form-review-field">
                <dt className="form-review-label">
                  {field.label}
                  {field.label.endsWith("?") ? " " : ": "}
                </dt>
                <dd className="form-review-value">
                  {field.value !== undefined ? (
                    field.value
                  ) : (
                    <span className="form-review-no-response">Missing!</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <div className="form-review-section-action">
            <button
              type="button"
              className="form-review-change-link"
              onClick={() => onEditStep(section.stepId)}
            >
              Change
            </button>
          </div>
        </section>
      ))}
    </div>
  );
}
