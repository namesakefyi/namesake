import { RiArrowRightLine } from "@remixicon/react";
import { Heading } from "react-aria-components";
import { useWatch } from "react-hook-form";
import type { Step } from "#constants/forms";
import type { Data } from "#lib/forms/questions";
import {
  resolveDescription,
  resolveTitle,
} from "#lib/forms/resolveStepContent";
import { slugify } from "#lib/utils/slugify";
import { smartquotes } from "#lib/utils/smartquotes";
import { Button } from "../../common/Button";
import { useFormStep } from "../FormContainer/FormStepContext";
import { FormStepQuestions } from "./FormStepQuestions";
import "./FormStep.css";
import clsx from "clsx";
import { useId } from "react";

export interface FormStepProps {
  stepConfig: Step;

  /**
   * Optional styles for the container.
   */
  className?: string;
}

export function FormStep({ stepConfig, className }: FormStepProps) {
  const data = useWatch() as Data;
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
      <div className="form-step-content">
        <FormStepQuestions step={stepConfig} data={data} />
      </div>
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
