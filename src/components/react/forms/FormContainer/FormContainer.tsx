import type { PortableTextProps } from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import { RiMegaphoneLine } from "@remixicon/react";
import { useCallback, useMemo, useRef, useState } from "react";
import { FormProvider } from "react-hook-form";
import { Banner } from "@/components/react/common/Banner";
import { ProgressCircle } from "@/components/react/common/ProgressCircle";
import { FormCompleteStep } from "@/components/react/forms/FormCompleteStep";
import { FormNavigation } from "@/components/react/forms/FormNavigation";
import { FormReviewStep } from "@/components/react/forms/FormReviewStep";
import { FormTitleStep } from "@/components/react/forms/FormTitleStep/FormTitleStep";
import { type FormSlug, getFormConfig } from "@/constants/forms";
import { createFormSubmitHandler } from "@/forms/createFormSubmitHandler";
import type { FormPdfMetadata } from "@/forms/getFormPdfMetadata";
import { useFormData } from "@/forms/useFormData";
import { useFormState } from "@/forms/useFormState";
import type { Cost } from "@/utils/formatTotalCosts";
import { FormStepContext } from "./FormStepContext";
import "./FormContainer.css";

export interface FormContainerProps {
  /** Form slug to look up config. Must be registered in getFormConfig. */
  slug: FormSlug;

  /** The title of the form. */
  title: string;

  /** An optional description to provide more context. */
  description?: string;

  /** Optional banner content (Portable Text) to display on the title step. */
  banner?: PortableTextProps["value"];

  /** The date the form was last updated. */
  updatedAt?: string;

  /** The PDF metadata for forms that will be generated. */
  pdfs?: FormPdfMetadata[];

  /** The costs associated with this form. */
  costs?: Cost[];
}

export function FormContainer({
  slug,
  title,
  description,
  banner,
  updatedAt,
  pdfs,
  costs,
}: FormContainerProps) {
  const config = getFormConfig(slug);

  if (!config) {
    throw new Error(
      `FormContainer: No form registered for slug "${slug}". Add it to getFormConfig.`,
    );
  }

  const { steps } = config;
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
    containerRef.current?.scrollIntoView({ block: "start" });
  }, []);

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
            updatedAt={updatedAt ?? ""}
            totalSteps={totalSteps}
            onStart={onStart}
          >
            {banner && (
              <Banner icon={RiMegaphoneLine}>
                <PortableText value={banner} />
              </Banner>
            )}
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
            slug={config.slug}
            onRedownload={onSubmit}
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
    updatedAt,
    title,
    description,
    banner,
    config.slug,
    totalSteps,
    onStart,
    onSubmit,
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
        className="form-container form-container-loading"
        ref={containerRef}
      >
        <ProgressCircle isIndeterminate aria-label="Loading form" size={40} />
      </section>
    );
  }

  return (
    <FormProvider {...form}>
      <FormStepContext.Provider value={stepContextValue}>
        <section className="form-container" ref={containerRef}>
          {showNavigation && <FormNavigation />}
          <div className="form-container-content">{currentStepComponent}</div>
        </section>
      </FormStepContext.Provider>
    </FormProvider>
  );
}
