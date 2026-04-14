import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";
import { memo } from "react";
import { Button } from "../../common/Button";
import { ProgressBar } from "../../common/ProgressBar";
import { useFormStep } from "../FormContainer";
import "./FormNavigation.css";
import { Fragment } from "react/jsx-runtime";

export const FormNavigation = memo(function FormNavigation() {
  const { formTitle, currentStepIndex, totalSteps, phase, onNext, onBack } =
    useFormStep();

  const disableBack = ["editing"].includes(phase);
  const disableNext = ["review", "editing", "submitting"].includes(phase);

  const progressBarValue = ["review", "editing", "submitting"].includes(phase)
    ? totalSteps + 1
    : currentStepIndex;

  return (
    <nav className="form-navigation">
      <div className="form-navigation-buttons">
        <Button
          onPress={onBack}
          variant="secondary"
          icon={RiArrowLeftLine}
          aria-label="Previous step"
          className="form-navigation-button"
          isDisabled={disableBack}
        />
        <Button
          onPress={onNext}
          variant="secondary"
          icon={RiArrowRightLine}
          aria-label="Next step"
          className="form-navigation-button"
          isDisabled={disableNext}
        />
      </div>
      <div className="form-progress">
        <ProgressBar
          label={formTitle}
          value={progressBarValue}
          valueLabel={<Fragment />}
          maxValue={totalSteps + 1}
          formatOptions={{ style: "decimal" }}
        />
      </div>
    </nav>
  );
});
