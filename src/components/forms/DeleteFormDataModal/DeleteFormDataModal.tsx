import { RiDeleteBin2Line } from "@remixicon/react";
import { useEffect, useState } from "react";
import { clearAllFields, getAllFields } from "../../../db/database";
import { Button } from "../../common/Button";
import { Heading } from "../../common/Content";
import { Dialog, DialogTrigger } from "../../common/Dialog";
import { Modal } from "../../common/Modal";
import "./DeleteFormDataModal.css";
import { UAParser } from "ua-parser-js";
import { Banner } from "../../common/Banner";

export function DeleteFormDataModal() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [responseCount, setResponseCount] = useState<number | null>(null);

  const { device } = UAParser(navigator.userAgent);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const fields = await getAllFields();
        setResponseCount(fields.length);
      } catch (error) {
        console.error("Failed to fetch response count:", error);
        setResponseCount(0);
      }
    };

    fetchCount();
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await clearAllFields();
      setIsOpen(false);
      setResponseCount(0);
    } catch (error) {
      setErrorMessage(`Failed to delete form data. Error: ${error}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const hasData = responseCount !== null && responseCount > 0;

  return (
    <div className="delete-form-data-container">
      {responseCount === null ? (
        <p>Loading...</p>
      ) : hasData ? (
        <p>
          There are{" "}
          <strong>{`${responseCount} response${responseCount !== 1 ? "s" : ""}`}</strong>{" "}
          stored on this browser. Anyone else who visits Namesake on{" "}
          <strong>{`this ${device.model ?? "device"}`}</strong> will be able to
          see your responses.
        </p>
      ) : (
        <p>
          There are <strong>no form responses</strong> stored on this browser.
          If you are using a public computer, remember to clean up any
          downloaded files when you are done!
        </p>
      )}
      {hasData && (
        <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
          <Button variant="secondary" icon={RiDeleteBin2Line}>
            Clear data
          </Button>
          <Modal isDismissable>
            <Dialog>
              <div className="delete-form-data-modal">
                <Heading slot="title">Clear data?</Heading>
                <p className="delete-form-data-modal-description">
                  This will permanently delete all{" "}
                  <strong>
                    {`${responseCount} form ${responseCount !== 1 ? "responses" : "response"}`}
                  </strong>{" "}
                  from this browser. You cannot undo this action.
                </p>
                {errorMessage && (
                  <Banner variant="error">{errorMessage}</Banner>
                )}
                <div className="delete-form-data-modal-actions">
                  <Button
                    slot="close"
                    variant="secondary"
                    isDisabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    icon={RiDeleteBin2Line}
                    onPress={handleDelete}
                    isPending={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Clear all data"}
                  </Button>
                </div>
              </div>
            </Dialog>
          </Modal>
        </DialogTrigger>
      )}
    </div>
  );
}
