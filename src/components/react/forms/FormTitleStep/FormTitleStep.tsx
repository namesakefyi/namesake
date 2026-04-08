import {
  type RemixiconComponentType,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiFileCheckLine,
  RiShieldKeyholeLine,
  RiTimerLine,
} from "@remixicon/react";
import { useEffect, useState } from "react";
import { type IBrowser, type IDevice, UAParser } from "ua-parser-js";
import type { FormPdfMetadata } from "@/forms/getFormPdfMetadata";
import { formatTimeEstimate } from "@/utils/formatTimeEstimate";
import { smartquotes } from "@/utils/smartquotes";
import { Button } from "../../common/Button";
import "./FormTitleStep.css";
import { formatBrowser } from "@/utils/formatBrowser";
import { formatDevice } from "@/utils/formatDevice";
import { Heading } from "../../common/Content/Content";

const formatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

function FormInfo({ children }: { children: React.ReactNode }) {
  return <ul className="form-info">{children}</ul>;
}

function FormInfoItemTitle({ children }: { children: React.ReactNode }) {
  return <span className="form-info-title">{children}</span>;
}

function FormInfoItemDescription({ children }: { children: React.ReactNode }) {
  return <div className="form-info-description">{children}</div>;
}

interface FormInfoItemProps {
  icon: RemixiconComponentType;
  children: React.ReactNode;
}

function FormInfoItem({ icon: Icon, children }: FormInfoItemProps) {
  return (
    <li>
      <Icon />
      {children}
    </li>
  );
}

export interface FormTitleStepProps {
  /**
   * The title of the form.
   */
  title: string;

  /**
   * The description of the form.
   */
  description?: string | null;

  /**
   * Child content.
   */
  children?: React.ReactNode;

  /**
   * Handler for when the user clicks the start button.
   */
  onStart: () => void;

  /**
   * The PDF metadata for forms that will be generated.
   */
  pdfs: FormPdfMetadata[];

  /**
   * The total number of steps in the form.
   */
  totalSteps: number;

  /**
   * The date the form was last updated.
   */
  updatedAt: string;
}

export function FormTitleStep({
  title,
  description,
  children,
  onStart,
  pdfs,
  totalSteps,
  updatedAt,
}: FormTitleStepProps) {
  const [device, setDevice] = useState<IDevice | null>(null);
  const [browser, setBrowser] = useState<IBrowser | null>(null);
  const timeEstimate = formatTimeEstimate(totalSteps);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setDevice(UAParser(navigator.userAgent).device);
      setBrowser(UAParser(navigator.userAgent).browser);
    }
  }, []);

  return (
    <section className="form-title-step">
      <header className="form-title-step-header">
        <a href="/forms" className="form-title-step-back-link">
          <RiArrowLeftLine /> All forms
        </a>
        <Heading className="form-title-step-heading">
          {smartquotes(title)}
        </Heading>
        {description && (
          <p className="form-title-step-description">
            {smartquotes(description)}
          </p>
        )}
      </header>
      {children}
      <FormInfo>
        <FormInfoItem icon={RiFileCheckLine}>
          <FormInfoItemTitle>
            This form helps you fill out name change documents, including:
          </FormInfoItemTitle>
          {pdfs.length > 0 && (
            <FormInfoItemDescription>
              <ul className="form-info-pdf-list">
                {pdfs.map((pdf) => (
                  <li key={pdf.pdfId}>
                    {pdf.title}
                    {pdf.code && ` (${pdf.code})`}
                  </li>
                ))}
              </ul>
            </FormInfoItemDescription>
          )}
        </FormInfoItem>
        {timeEstimate && (
          <FormInfoItem icon={RiTimerLine}>
            <FormInfoItemTitle>
              Takes about <strong>{timeEstimate}</strong>.
            </FormInfoItemTitle>
            <FormInfoItemDescription>
              We’ll provide guidance for common questions.
            </FormInfoItemDescription>
          </FormInfoItem>
        )}
        <FormInfoItem icon={RiShieldKeyholeLine}>
          <FormInfoItemTitle>
            Responses are securely stored in{" "}
            <strong>{formatBrowser(browser)}</strong> on{" "}
            <strong>{formatDevice(device)}</strong>.
          </FormInfoItemTitle>
          <FormInfoItemDescription>
            For security, your information never leaves this device.
          </FormInfoItemDescription>
        </FormInfoItem>
      </FormInfo>
      <footer className="form-title-step-footer">
        <Button
          onPress={onStart}
          variant="primary"
          size="large"
          endIcon={RiArrowRightLine}
          className="form-title-step-button"
        >
          Start
        </Button>
      </footer>
      {updatedAt && (
        <div className="form-title-step-date-updated">
          Form last revised on{" "}
          <time dateTime={updatedAt}>
            {formatter.format(new Date(updatedAt))}
          </time>
          .
        </div>
      )}
    </section>
  );
}
