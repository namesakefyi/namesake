import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DropZone,
  FileTrigger,
  Form,
  Input,
  isFileDropItem,
  Label,
  Modal,
  ModalOverlay,
  TextField,
} from "react-aria-components";
import type { AddPdfResult, Jurisdiction } from "../types";
import { fileToBase64, parseJson } from "../utils";

interface AddPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (id: string) => void;
}

export function AddPdfModal({ isOpen, onClose, onSuccess }: AddPdfModalProps) {
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/jurisdictions")
      .then(parseJson<Jurisdiction[]>)
      .then(setJurisdictions)
      .catch(() => setError("Failed to load jurisdictions"));
  }, []);

  async function handleSubmit(e: {
    preventDefault(): void;
    currentTarget: HTMLFormElement;
  }) {
    e.preventDefault();
    if (!pdfFile) return;
    const data = new FormData(e.currentTarget);
    const title = data.get("title") as string;
    const code = data.get("code") as string;
    const jurisdiction = data.get("jurisdiction") as string;
    const canonicalUrl = data.get("canonicalUrl") as string;

    setSubmitting(true);
    setError(null);
    try {
      const pdfBase64 = await fileToBase64(pdfFile);
      const res = await fetch("/api/pdfs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          code,
          jurisdiction,
          canonicalUrl,
          pdfBase64,
        }),
      });
      const result = await parseJson<AddPdfResult>(res);
      if (!res.ok) throw new Error(result.error ?? "Failed to add PDF");
      onSuccess(result.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalOverlay
      className="modal-overlay"
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <Modal className="modal">
        <Dialog aria-label="Add PDF">
          <h2 className="modal-title">Add PDF</h2>

          <Form onSubmit={handleSubmit} className="modal-form">
            <DropZone
              className={`drop-zone${pdfFile ? " has-file" : ""}`}
              onDrop={async (e) => {
                const fileItem = e.items
                  .filter(isFileDropItem)
                  .find((i) => i.type === "application/pdf");
                if (fileItem) setPdfFile(await fileItem.getFile());
              }}
            >
              <FileTrigger
                acceptedFileTypes={[".pdf"]}
                onSelect={(fl) => fl?.[0] && setPdfFile(fl[0])}
              >
                <Button className="drop-zone-btn">
                  {pdfFile ? (
                    <span className="drop-zone-filename">{pdfFile.name}</span>
                  ) : (
                    <span className="drop-zone-hint">
                      Drop a PDF here, or click to browse
                    </span>
                  )}
                </Button>
              </FileTrigger>
            </DropZone>

            <TextField className="form-field" isRequired name="title">
              <Label className="form-label">Form title</Label>
              <Input className="form-input" />
            </TextField>

            <TextField className="form-field" name="code">
              <Label className="form-label">Form code (optional)</Label>
              <Input className="form-input" />
            </TextField>

            <TextField className="form-field" isRequired name="canonicalUrl">
              <Label className="form-label">Canonical URL</Label>
              <Input className="form-input" type="url" />
            </TextField>

            <div className="form-field">
              <label className="form-label" htmlFor="jurisdiction">
                Jurisdiction
              </label>
              <select
                id="jurisdiction"
                name="jurisdiction"
                className="form-input"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select…
                </option>
                {jurisdictions.map((jurisdiction) => (
                  <option key={jurisdiction.id} value={jurisdiction.id}>
                    {jurisdiction.name}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="modal-actions">
              <Button type="button" className="btn" onPress={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn btn-primary"
                isPending={submitting}
                isDisabled={!pdfFile}
              >
                {({ isPending }) => (isPending ? "Creating…" : "Create")}
              </Button>
            </div>
          </Form>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
