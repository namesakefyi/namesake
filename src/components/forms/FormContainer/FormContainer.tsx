import { useCallback, useMemo, useRef, useState } from "react";
import { FormProvider } from "react-hook-form";
import type { FormConfig, FormSlug } from "../../../constants/forms";
import { createFormSubmitHandler } from "../../../forms/createFormSubmitHandler";
import type { FormPdfMetadata } from "../../../forms/getFormPdfMetadata";
import { useFormData } from "../../../forms/useFormData";
import { useFormState } from "../../../forms/useFormState";
import { ProgressCircle } from "../../common/ProgressCircle";
import { FormCompleteStep } from "../FormCompleteStep";
import { FormNavigation } from "../FormNavigation";
import { FormReviewStep } from "../FormReviewStep";
import { FormTitleStep } from "../FormTitleStep/FormTitleStep";
import { FormStepContext } from "./FormStepContext";
import "./FormContainer.css";

export interface FormContainerProps {
  slug: FormSlug;
  config: FormConfig;

  /** The PDF metadata for forms that will be generated. */
  pdfs?: FormPdfMetadata[];

  /** Render inline within a page rather than as a full-page experience. */
  inline?: boolean;

  /** Optional content to render on the title step (e.g. a <Banner>). */
  children?: React.ReactNode;
}

export function FormContainer({
  slug,
  config,
  pdfs,
  inline = false,
  children,
}: FormContainerProps) {
  const { title, description, costs, steps } = config;
  const form = useFormData(config);
  const onSubmit = createFormSubmitHandler(config, form);

  const {
    isLoading,
    phase,
    send,
    activeStep,
    currentStepIndex,
    totalSteps,
    goNext,
    goBack,
  } = useFormState(slug, steps, form.getValues);

  const containerRef = useRef<HTMLDivElement>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const scrollToFormTop = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (inline) {
      if (el.getBoundingClientRect().top < 0) {
        el.scrollIntoView({ block: "start" });
      }
      return;
    }
    el.scrollIntoView({ block: "start" });
  }, [inline]);

  const focusStepContent = useCallback(() => {
    requestAnimationFrame(() => {
      const stepForm = containerRef.current?.querySelector(
        ".form-step",
      ) as HTMLElement | null;

      if (stepForm) {
        stepForm.focus({ preventScroll: true });
      }
    });
  }, []);

  const onStart = useCallback(() => {
    send({ type: "START" });
    scrollToFormTop();
    focusStepContent();
  }, [send, scrollToFormTop, focusStepContent]);

  const onNext = useCallback(() => {
    goNext();
    scrollToFormTop();
    focusStepContent();
  }, [goNext, scrollToFormTop, focusStepContent]);

  const onBack = useCallback(() => {
    goBack();
    scrollToFormTop();
    focusStepContent();
  }, [goBack, scrollToFormTop, focusStepContent]);

  const onEditStep = useCallback(
    (stepId: string) => {
      send({ type: "EDIT_STEP", stepId });
      scrollToFormTop();
      focusStepContent();
    },
    [send, scrollToFormTop, focusStepContent],
  );

  const handleFormSubmit = useCallback(
    async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();

      switch (phase) {
        case "editing":
          send({ type: "SAVE_EDIT" });
          scrollToFormTop();
          focusStepContent();
          return;
        case "review":
          setSubmitError(null);
          send({ type: "SUBMIT" });
          try {
            await onSubmit(e);
            send({ type: "SUBMIT_DONE" });
            scrollToFormTop();
          } catch (error) {
            console.error("Form submission failed:", error);
            send({ type: "SUBMIT_ERROR" });
            setSubmitError(
              "Something went wrong while generating your download. Please try again.",
            );
          }
          return;
        default:
          onNext();
      }
    },
    [phase, send, onSubmit, onNext, scrollToFormTop, focusStepContent],
  );

  const currentStepComponent = useMemo(() => {
    switch (phase) {
      case "title":
        return (
          <FormTitleStep
            title={title}
            description={description}
            pdfs={pdfs ?? []}
            totalSteps={totalSteps}
            onStart={onStart}
            headingLevel={inline ? 2 : 1}
          >
            {children}
          </FormTitleStep>
        );
      case "filling":
      case "editing": {
        if (!activeStep) return null;
        const StepComponent = activeStep.component;
        return <StepComponent stepConfig={activeStep} />;
      }
      case "review":
      case "submitting":
        return <FormReviewStep steps={steps} />;
      case "complete":
        return (
          <FormCompleteStep
            title={title}
            slug={slug}
            onRedownload={onSubmit}
            inline={inline}
            headingLevel={inline ? 2 : 1}
          />
        );
      default:
        return null;
    }
  }, [
    phase,
    steps,
    activeStep,
    pdfs,
    title,
    description,
    children,
    slug,
    totalSteps,
    onStart,
    onSubmit,
    inline,
  ]);

  const showNavigation = !["title", "complete"].includes(phase);

  const stepContextValue = {
    onNext,
    onBack,
    formTitle: title,
    formDescription: description,
    currentStepIndex,
    totalSteps,
    phase,
    onSubmit: handleFormSubmit,
    onEditStep,
    submitError,
    costs,
  };

  if (isLoading) {
    return (
      <section
        className={
          inline
            ? "form-container form-container-loading not-content"
            : "form-container form-container-loading"
        }
        data-inline={inline || undefined}
        ref={containerRef}
      >
        <ProgressCircle isIndeterminate aria-label="Loading form" size={40} />
      </section>
    );
  }

  return (
    <FormProvider {...form}>
      <FormStepContext.Provider value={stepContextValue}>
        <section
          className={inline ? "form-container not-content" : "form-container"}
          data-inline={inline || undefined}
          ref={containerRef}
        >
          {showNavigation && <FormNavigation />}
          <div className="form-container-content">{currentStepComponent}</div>
        </section>
      </FormStepContext.Provider>
    </FormProvider>
  );
}
