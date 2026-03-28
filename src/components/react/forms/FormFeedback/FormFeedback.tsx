import {
  RiArrowRightLine,
  RiHandHeartLine,
  RiHeart3Line,
  RiShareForwardLine,
  RiThumbDownLine,
  RiThumbUpLine,
} from "@remixicon/react";
import { useActionState, useRef } from "react";
import { Button } from "@/components/react/common/Button";
import { Form } from "@/components/react/common/Form";
import { Radio, RadioGroup } from "@/components/react/common/RadioGroup";
import { TextArea } from "@/components/react/common/TextArea";
import type { FormFeedbackSentiment, FormSlug } from "@/constants/forms";
import "./FormFeedback.css";
import { Banner } from "../../common/Banner";
import { Heading } from "../../common/Content";

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

  const [state, submitAction, isPending] = useActionState<
    SubmitState,
    FormData
  >(async (_prev, formData) => {
    const sentiment = formData.get("sentiment") as FormFeedbackSentiment;
    const comment = (formData.get("comment") as string) ?? "";

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_slug: slug,
          sentiment,
          comment: comment.trim() || undefined,
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
              <Button variant="secondary" onClick={handleShare}>
                <RiShareForwardLine aria-hidden />
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
        <Form action={submitAction}>
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
              <RiThumbUpLine size={24} aria-hidden />
              It was easy
            </Radio>
            <Radio value="negative" className="form-feedback-sentiment-option">
              <RiThumbDownLine size={24} aria-hidden />
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
        </Form>
      )}
    </div>
  );
}
