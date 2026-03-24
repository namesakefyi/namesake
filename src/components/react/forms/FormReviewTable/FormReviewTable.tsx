import { useFormContext } from "react-hook-form";
import { useFormStep } from "@/components/react/forms/FormContainer";
import type { FormData } from "@/constants/fields";
import { resolveFormVisibility } from "@/forms/formVisibility";
import type { Step } from "@/forms/types";
import { formatFieldValue, getFieldLabel } from "@/utils/formatReviewFields";
import "./FormReviewTable.css";
import { smartquotes } from "@/utils/smartquotes";

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

  const reviewSections: ReviewSection[] = sections
    .filter(({ fields }) => fields.length > 0)
    .map(({ stepId, fields }) => ({
      stepId,
      fields: fields.map((fieldName) => ({
        fieldName,
        label: smartquotes(getFieldLabel(fieldName)),
        value: formatFieldValue(fieldName, formData[fieldName]),
      })),
    }));

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
