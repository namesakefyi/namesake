import { RiArrowRightLine } from "@remixicon/react";
import { Heading } from "react-aria-components";
import { useFormContext } from "react-hook-form";
import type { FieldName, FormData } from "../../../constants/fields";
import { getFieldWhen } from "../../../forms/formVisibility";
import {
  resolveDescription,
  resolveTitle,
} from "../../../forms/resolveStepContent";
import type { Step } from "../../../forms/types";
import { slugify } from "../../../utils/slugify";
import { smartquotes } from "../../../utils/smartquotes";
import { Button } from "../../common/Button";
import { useFormStep } from "../FormContainer";
import "./FormStep.css";
import clsx from "clsx";
import { useId } from "react";

/**
 * Returns whether a specific field should be visible within a step, based on
 * the field's `when` predicate and the current live form values.
 *
 * Returns `false` if the field is not listed in the step's fields array.
 * Returns `true` if the field has no `when` predicate (always visible).
 */
export function useFieldVisible(
  stepConfig: Step,
  fieldName: FieldName,
): boolean {
  const form = useFormContext();
  const data = form.watch() as FormData;
  const result = getFieldWhen(stepConfig.fields, fieldName);
  if (result === undefined) return false;
  return result === null || result(data);
}

export interface FormStepProps {
  /**
   * The step configuration containing title, description, fields, etc.
   */
  stepConfig: Step;

  /**
   * The form fields to render.
   */
  children?: React.ReactNode;

  /**
   * Optional styles for the container.
   */
  className?: string;
}

export function FormStep({ stepConfig, children, className }: FormStepProps) {
  const form = useFormContext();
  const data = form.watch() as FormData;
  const title = resolveTitle(stepConfig, data);
  const description = resolveDescription(stepConfig, data);
  const titleId = slugify(title);
  const descriptionId = useId();
  const { onSubmit, phase } = useFormStep();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form
      className={clsx("form-step", className)}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onSubmit={handleSubmit}
      tabIndex={-1}
    >
      <header>
        <Heading className="form-step-title" id={titleId}>
          {smartquotes(title)}
        </Heading>
        {description && (
          <p id={descriptionId} className="form-step-description">
            {smartquotes(description)}
          </p>
        )}
      </header>
      <div className="form-step-content">{children}</div>
      <Button
        type="submit"
        variant="primary"
        endIcon={RiArrowRightLine}
        className="form-step-button"
      >
        {phase === "editing" ? "Save Changes" : "Continue"}
      </Button>
    </form>
  );
}

interface FormSubsectionProps {
  title?: string;
  children?: React.ReactNode;
  isVisible?: boolean;
}

export function FormSubsection({
  title,
  children,
  isVisible = true,
}: FormSubsectionProps) {
  if (!isVisible) return null;

  return (
    <fieldset className="form-subsection" disabled={!isVisible}>
      {title && <Heading>{smartquotes(title)}</Heading>}
      {children}
    </fieldset>
  );
}
