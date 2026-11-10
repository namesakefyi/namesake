import {
  RiArrowRightLine,
  RiHandHeartLine,
  RiHeart3Line,
  RiShareForwardLine,
  RiThumbDownFill,
  RiThumbDownLine,
  RiThumbUpFill,
  RiThumbUpLine,
} from "@remixicon/react";
import { startTransition, useActionState, useRef, useState } from "react";
import type { FormProps } from "react-aria-components";
import {
  type FormFeedbackSentiment,
  type FormSlug,
  shouldRequestShareConsent,
} from "#constants/forms";
import { Button } from "../../common/Button";
import { Form } from "../../common/Form";
import { Radio, RadioGroup } from "../../common/RadioGroup";
import { TextArea } from "../../common/TextArea";
import "./FormFeedback.css";
import { Banner } from "../../common/Banner";
import { Heading } from "../../common/Content";
import { Dialog } from "../../common/Dialog";
import { Modal } from "../../common/Modal";

interface FormFeedbackProps {
  slug: FormSlug;
}

const ERROR_MESSAGES: Record<number, string> = {
  403: "Feedback can only be submitted from pages at https://namesake.fyi.",
  429: "You've submitted feedback too many times. Try again in an hour.",
};

type SubmitError = { error: string; sentiment: string; comment: string };
type SubmitState = "idle" | "success" | SubmitError;

function isSubmitError(state: SubmitState): state is SubmitError {
  return typeof state === "object";
}

export function FormFeedback({ slug }: FormFeedbackProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Submission paused while asking for consent to share it publicly
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  const [state, submitAction, isPending] = useActionState<
    SubmitState,
    FormData
  >(async (_prev, formData) => {
    const sentiment = formData.get("sentiment") as FormFeedbackSentiment;
    const comment = (formData.get("comment") as string) ?? "";
    const shareConsentValue = formData.get("share_consent");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_slug: slug,
          sentiment,
          comment: comment.trim() || undefined,
          share_consent:
            shareConsentValue === null
              ? undefined
              : shareConsentValue === "true",
        }),
      });

      if (!response.ok) {
        const message =
          ERROR_MESSAGES[response.status] ??
          "Something went wrong. Please try again.";
        return { error: message, sentiment, comment };
      }

      wrapperRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      return "success";
    } catch {
      return {
        error: "Something went wrong. Please try again.",
        sentiment,
        comment,
      };
    }
  }, "idle");

  const handleSubmit: NonNullable<FormProps["onSubmit"]> = (event) => {
    const formData = new FormData(event.currentTarget);
    if (
      shouldRequestShareConsent(
        formData.get("sentiment") as FormFeedbackSentiment,
        formData.get("comment") as string,
      )
    ) {
      event.preventDefault();
      setPendingFormData(formData);
    }
  };

  const handleConsentSubmit = (shareConsent: boolean) => {
    if (!pendingFormData) return;

    pendingFormData.set("share_consent", String(shareConsent));
    setPendingFormData(null);
    startTransition(() => submitAction(pendingFormData));
  };

  const canShare = "share" in navigator;

  const handleShare = () => {
    navigator.share({
      title: document.title,
      url: window.location.href,
    });
  };

  return (
    <div className="form-feedback" ref={wrapperRef}>
      {state === "success" ? (
        <div className="form-feedback-success" role="alert">
          <RiHeart3Line size={32} aria-hidden />
          <div className="form-feedback-success-content">
            <strong>Thank you for your feedback!</strong>
            <p>
              Good luck submitting your paperwork. If this form helped you,
              consider sharing it with others or donating to support our work.
            </p>
          </div>
          <div className="form-feedback-success-actions">
            {canShare && (
              <Button
                variant="secondary"
                icon={RiShareForwardLine}
                onPress={handleShare}
              >
                Share
              </Button>
            )}
            <a href="https://namesake.fyi/donate" className="react-aria-Button">
              <RiHandHeartLine aria-hidden />
              Donate
            </a>
          </div>
        </div>
      ) : (
        <Form action={submitAction} onSubmit={handleSubmit}>
          <Heading level={2} className="form-feedback-title">
            Help improve this form
          </Heading>
          <RadioGroup
            name="sentiment"
            isRequired
            orientation="horizontal"
            className="form-feedback-sentiment"
            errorMessage="Please select a rating."
            aria-label="Form rating"
            defaultValue={isSubmitError(state) ? state.sentiment : undefined}
          >
            <Radio value="positive" className="form-feedback-sentiment-option">
              <RiThumbUpLine size={24} aria-hidden className="icon-outline" />
              <RiThumbUpFill size={24} aria-hidden className="icon-filled" />
              It was easy
            </Radio>
            <Radio value="negative" className="form-feedback-sentiment-option">
              <RiThumbDownLine size={24} aria-hidden className="icon-outline" />
              <RiThumbDownFill size={24} aria-hidden className="icon-filled" />
              Had some problems
            </Radio>
          </RadioGroup>
          <TextArea
            name="comment"
            label="Feedback"
            maxLength={1000}
            defaultValue={isSubmitError(state) ? state.comment : undefined}
          />
          {isSubmitError(state) && (
            <Banner variant="error">{state.error}</Banner>
          )}
          <Button
            type="submit"
            variant="primary"
            endIcon={RiArrowRightLine}
            isPending={isPending}
          >
            Submit
          </Button>
          <Modal
            isDismissable
            isOpen={pendingFormData !== null}
            onOpenChange={(isOpen) => !isOpen && setPendingFormData(null)}
          >
            <ShareConsentDialog onSubmit={handleConsentSubmit} />
          </Modal>
        </Form>
      )}
    </div>
  );
}

function ShareConsentDialog({
  onSubmit,
}: {
  onSubmit: (shareConsent: boolean) => void;
}) {
  const [shareConsent, setShareConsent] = useState(true);

  return (
    <Dialog className="form-feedback-consent">
      <Heading slot="title">Can we publicly share your feedback?</Heading>
      <p className="form-feedback-consent-description">
        It won’t be linked to your name or identity. Sharing positive feedback helps
        us fundraise and expand support.
      </p>
      <RadioGroup
        aria-label="Share feedback publicly"
        value={String(shareConsent)}
        onChange={(value) => setShareConsent(value === "true")}
      >
        <Radio value="true">Yes</Radio>
        <Radio value="false">No</Radio>
      </RadioGroup>
      <Button
        variant="primary"
        endIcon={RiArrowRightLine}
        onPress={() => onSubmit(shareConsent)}
        className="form-feedback-consent-submit"
      >
        Submit
      </Button>
    </Dialog>
  );
}
