import type { SubmitEvent } from "react";
import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DropZone,
  FileTrigger,
  Input,
  isFileDropItem,
  Label,
  ListBox,
  ListBoxItem,
  Modal,
  ModalOverlay,
  Popover,
  Select,
  SelectValue,
  TextField,
} from "react-aria-components";
import type { AddPdfResult, Jurisdiction } from "../types.ts";
import { fileToBase64 } from "../utils.ts";

interface AddPdfModalProps {
  onClose: () => void;
  onSuccess: (id: string) => void;
}

export function AddPdfModal({ onClose, onSuccess }: AddPdfModalProps) {
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [jurisdiction, setJurisdiction] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/jurisdictions")
      .then((r) => r.json<Jurisdiction[]>())
      .then(setJurisdictions)
      .catch(() => setError("Failed to load jurisdictions"));
  }, []);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title || !jurisdiction || !pdfFile) return;

    setSubmitting(true);
    setError(null);
    try {
      const pdfBase64 = await fileToBase64(pdfFile);
      const res = await fetch("/api/pdfs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, code, jurisdiction, pdfBase64 }),
      });
      const data = await res.json<AddPdfResult>();
      if (!res.ok) throw new Error(data.error ?? "Failed to add PDF");
      onSuccess(data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalOverlay
      className="modal-overlay"
      isOpen
      onOpenChange={(open) => !open && onClose()}
    >
      <Modal className="modal">
        <Dialog aria-label="Add PDF">
          <h2 className="modal-title">Add PDF</h2>

          <form onSubmit={handleSubmit} className="modal-form">
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

            <TextField className="form-field" isRequired>
              <Label className="form-label">Form title</Label>
              <Input
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </TextField>

            <TextField className="form-field">
              <Label className="form-label">Form code (optional)</Label>
              <Input
                className="form-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </TextField>

            <Select
              className="form-field"
              isRequired
              value={jurisdiction}
              onChange={(key) => setJurisdiction(key ? String(key) : null)}
            >
              <Label className="form-label">Jurisdiction</Label>
              <Button className="form-input form-select-btn">
                <SelectValue>
                  {({ isPlaceholder, selectedText }) =>
                    isPlaceholder ? "Select…" : selectedText
                  }
                </SelectValue>
                <span className="form-select-arrow" aria-hidden="true">
                  ▾
                </span>
              </Button>
              <Popover className="form-select-popover">
                <ListBox className="form-select-listbox">
                  {jurisdictions.map((j) => (
                    <ListBoxItem
                      key={j.abbreviation}
                      id={j.abbreviation}
                      className="form-select-item"
                    >
                      {j.name}
                    </ListBoxItem>
                  ))}
                </ListBox>
              </Popover>
            </Select>

            {error && <p className="form-error">{error}</p>}

            <div className="modal-actions">
              <Button type="button" className="btn" onPress={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn btn-primary"
                isPending={submitting}
                isDisabled={!title || !jurisdiction || !pdfFile}
              >
                {({ isPending }) => (isPending ? "Creating…" : "Create")}
              </Button>
            </div>
          </form>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
