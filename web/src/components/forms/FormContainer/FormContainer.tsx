import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider } from "react-hook-form";
import type { FormMeta, Step } from "#constants/forms";
import { createFormSubmitHandler } from "#lib/forms/createFormSubmitHandler";
import { downloadBlankPdfPacket } from "#lib/forms/downloadBlankPdfPacket";
import { loadFormDownload, useFormSteps } from "#lib/forms/loadForm";
import { useFormData } from "#lib/forms/useFormData";
import {
  type PersistedSnapshot,
  useFormState,
  usePersistedSnapshot,
} from "#lib/forms/useFormState";
import { FormCompleteStep } from "../FormCompleteStep";
import { FormNavigation } from "../FormNavigation";
import { FormReviewStep } from "../FormReviewStep";
import { FormStep } from "../FormStep";
import {
  FormTitleStep,
  type FormTitleStepProps,
} from "../FormTitleStep/FormTitleStep";
import { FormStepContext } from "./FormStepContext";
import "./FormContainer.css";

export interface FormContainerProps {
  /** Worked out while pages build, so the title step needs no form code. */
  form: Pick<FormMeta, "title" | "description" | "costs"> & {
    id: string;
    stepCount: number;
    pdfs: FormTitleStepProps["pdfs"];
  };

  /** Render inline within a page rather than as a full-page experience. */
  inline?: boolean;

  /** Optional content to render on the title step (e.g. a <Banner>). */
  children?: React.ReactNode;
}

const containerClass = (inline: boolean) =>
  inline ? "form-container not-content" : "form-container";

/**
 * Needs only `form`, so it renders on the server and works before the form's
 * steps and saved progress load.
 */
function TitleStep({
  form,
  inline = false,
  children,
  totalSteps = form.stepCount,
  onStart,
}: FormContainerProps & { totalSteps?: number; onStart?: () => void }) {
  const onDownloadBlank = useCallback(
    () => downloadBlankPdfPacket(() => loadFormDownload(form.id)),
    [form.id],
  );
  return (
    <FormTitleStep
      title={form.title}
      description={form.description}
      pdfs={form.pdfs}
      totalSteps={totalSteps}
      onStart={onStart}
      onDownloadBlank={onDownloadBlank}
      headingLevel={inline ? 2 : 1}
    >
      {children}
    </FormTitleStep>
  );
}

function FormTitlePlaceholder(props: FormContainerProps) {
  const inline = props.inline ?? false;
  return (
    <section
      className={containerClass(inline)}
      data-inline={inline || undefined}
    >
      <div className="form-container-content">
        <TitleStep {...props} />
      </div>
    </section>
  );
}

export function FormContainer(props: FormContainerProps) {
  const steps = useFormSteps(props.form.id);
  const progress = usePersistedSnapshot(props.form.id);
  if (!steps || progress.isLoading) return <FormTitlePlaceholder {...props} />;
  return <LoadedFormContainer {...props} steps={steps} progress={progress} />;
}

function LoadedFormContainer({
  steps,
  progress,
  form: formProp,
  inline = false,
  children,
}: FormContainerProps & {
  steps: readonly Step[];
  progress: PersistedSnapshot;
}) {
  const { id: formId, title, description, costs } = formProp;
  const form = useFormData(steps);
  const loadDownload = useCallback(() => loadFormDownload(formId), [formId]);
  const onSubmit = createFormSubmitHandler({ steps, loadDownload }, form);

  const {
    phase,
    send,
    activeStep,
    currentStepIndex,
    totalSteps,
    goNext,
    goBack,
  } = useFormState(formId, steps, form.getValues, progress);

  const isFilling = phase !== "title";
  useEffect(() => {
    if (!isFilling) return;
    loadDownload().catch((error) => {
      console.error(`Failed to preload downloads for "${formId}":`, error);
    });
  }, [isFilling, loadDownload, formId]);

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
          <TitleStep
            form={formProp}
            inline={inline}
            totalSteps={totalSteps}
            onStart={onStart}
          >
            {children}
          </TitleStep>
        );
      case "filling":
      case "editing": {
        if (!activeStep) return null;
        return <FormStep key={activeStep.id} stepConfig={activeStep} />;
      }
      case "review":
      case "submitting":
        return <FormReviewStep steps={steps} />;
      case "complete":
        return (
          <FormCompleteStep
            title={title}
            formId={formId}
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
    formProp,
    children,
    title,
    formId,
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

  return (
    <FormProvider {...form}>
      <FormStepContext.Provider value={stepContextValue}>
        <section
          className={containerClass(inline)}
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
