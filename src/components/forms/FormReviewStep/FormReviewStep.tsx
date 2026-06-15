import { Heading } from "react-aria-components";
import { Banner } from "../../common/Banner";
import { Button } from "../../common/Button";
import "./FormReviewStep.css";
import { RiDownloadLine } from "@remixicon/react";
import type { Step } from "#forms/types";
import { useFormStep } from "../FormContainer/FormStepContext";
import { FormReviewTable } from "../FormReviewTable";

export interface FormReviewStepProps {
  /**
   * The step configurations to display in the review table.
   */
  steps: readonly Step[];
}

export function FormReviewStep({ steps }: FormReviewStepProps) {
  const { onSubmit, phase, submitError } = useFormStep();
  const isSubmitting = phase === "submitting";

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form
      className="form-review-step"
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
    >
      <header className="form-review-step-header">
        <Heading className="form-review-step-title">
          Review your information
        </Heading>
        <p className="form-review-description">
          Please review your answers before submitting. Once submitted,
          completed forms will download automatically.
        </p>
      </header>
      <div
        className="form-review-step-content"
        inert={isSubmitting || undefined}
      >
        <FormReviewTable steps={steps} />
      </div>
      <Button
        type="submit"
        variant="primary"
        icon={RiDownloadLine}
        size="large"
        className="form-review-step-button"
        isPending={isSubmitting}
        isDisabled={isSubmitting}
      >
        Finish and Download
      </Button>
      {submitError && <Banner variant="error">{submitError}</Banner>}
    </form>
  );
}
