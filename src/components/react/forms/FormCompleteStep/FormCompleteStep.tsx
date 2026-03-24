import { RiDownloadLine, RiRestartLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { clearFormProgress } from "@/db/database";
import { Button } from "../../common/Button";
import { Heading } from "../../common/Content/Content";
import { DeleteFormDataModal } from "../DeleteFormDataModal";
import { FormFeedback } from "../FormFeedback/FormFeedback";
import "./FormCompleteStep.css";
import type { FormSlug } from "@/constants/forms";

export interface FormCompleteStepProps {
  slug: FormSlug;
  title: string;
  onRedownload: (e: React.SubmitEvent<HTMLFormElement>) => void | Promise<void>;
}

export function FormCompleteStep({
  slug,
  title,
  onRedownload,
}: FormCompleteStepProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const previous = document.body.dataset.color;
    document.body.dataset.color = "green";
    return () => {
      document.body.dataset.color = previous ?? "";
    };
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDownloading(true);
    try {
      await onRedownload(e);
    } catch (error) {
      console.error("Re-download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRestart = async () => {
    await clearFormProgress(slug);
    window.location.reload();
  };

  return (
    <section className="form-complete-step">
      <header className="form-complete-step-header">
        <Heading level={1} className="form-complete-step-heading">
          Form complete!
        </Heading>
        <p className="form-complete-step-description">
          Check your downloads for your <strong>{title}</strong> packet. Review,
          print, and follow steps for filing.
        </p>
      </header>
      <div className="form-complete-step-content">
        <FormFeedback slug={slug} />
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
