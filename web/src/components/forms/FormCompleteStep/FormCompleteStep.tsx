import { RiDownloadLine, RiRestartLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { clearFormProgress } from "#db/database";
import { Button } from "../../common/Button";
import { Heading } from "../../common/Content/Content";
import { DeleteFormDataModal } from "../DeleteFormDataModal";
import { FormFeedback } from "../FormFeedback/FormFeedback";
import "./FormCompleteStep.css";

export interface FormCompleteStepProps {
  formId: string;
  title: string;
  onRedownload: () => Promise<void>;
  inline?: boolean;
  headingLevel?: 1 | 2 | 3;
}

export function FormCompleteStep({
  formId,
  title,
  onRedownload,
  inline = false,
  headingLevel = 1,
}: FormCompleteStepProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (inline) return;
    const previous = document.body.dataset.color;
    document.body.dataset.color = "green";
    return () => {
      document.body.dataset.color = previous ?? "";
    };
  }, [inline]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDownloading(true);
    try {
      await onRedownload();
    } catch (error) {
      console.error("Re-download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRestart = async () => {
    await clearFormProgress(formId);
    window.location.reload();
  };

  return (
    <section className="form-complete-step">
      <header className="form-complete-step-header">
        <Heading level={headingLevel} className="form-complete-step-heading">
          Form complete!
        </Heading>
        <p className="form-complete-step-description">
          Check your downloads for your <strong>{title}</strong> packet. Review,
          print, and follow steps for filing.
        </p>
      </header>
      <div className="form-complete-step-content">
        <FormFeedback formId={formId} />
        <DeleteFormDataModal />
        <div className="form-complete-actions">
          <form onSubmit={handleSubmit}>
            <Button
              type="submit"
              variant="secondary"
              icon={RiDownloadLine}
              isPending={isDownloading}
              isDisabled={isDownloading}
            >
              Redownload form
            </Button>
          </form>
          <Button
            variant="secondary"
            icon={RiRestartLine}
            onPress={handleRestart}
          >
            Restart form
          </Button>
        </div>
      </div>
    </section>
  );
}
