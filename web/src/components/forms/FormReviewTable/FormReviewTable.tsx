import { useFormContext } from "react-hook-form";
import type { Step } from "#constants/forms";
import type { FormData } from "#lib/forms/questions";
import { resolveFormVisibility } from "#lib/forms/resolveFormVisibility";
import { resolveText } from "#lib/forms/resolveText";
import { formatFieldValue } from "#lib/utils/formatFieldValue";
import { smartquotes } from "#lib/utils/smartquotes";
import { useFormStep } from "../FormContainer/FormStepContext";
import "./FormReviewTable.css";

export interface FormReviewTableProps {
  steps: readonly Step[];
}

export function FormReviewTable({ steps }: FormReviewTableProps) {
  const form = useFormContext<FormData>();
  const { onEditStep } = useFormStep();
  const formData = form.getValues();

  const reviewSections = resolveFormVisibility(steps, formData)
    .sections.map(({ step, fields }) => ({
      stepId: step.id,
      fields: fields.flatMap((field) => {
        const value = formatFieldValue(field.type, formData[field.id], {
          options: field.options,
          currency: field.currency,
        });
        if (field.optional && value === undefined) return [];
        return [
          {
            id: field.id,
            label: smartquotes(resolveText(field.reviewLabel, formData)),
            value,
          },
        ];
      }),
    }))
    .filter(({ fields }) => fields.length > 0);

  return (
    <div className="form-review-sections">
      {reviewSections.map((section) => (
        <section key={section.stepId} className="form-review-section">
          <dl className="form-review-list">
            {section.fields.map((field) => (
              <div key={field.id} className="form-review-field">
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
