import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  Input,
  Label,
  Modal,
  ModalOverlay,
  TextField,
} from "react-aria-components";

export function AddPdfModal({ onClose, onSuccess }) {
  const [jurisdictions, setJurisdictions] = useState([]);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch("/api/jurisdictions")
      .then((r) => r.json())
      .then(setJurisdictions);
  }, []);

  const handleFileChange = useCallback((e) => {
    setPdfFile(e.target.files?.[0] ?? null);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type === "application/pdf") setPdfFile(file);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !jurisdiction || !pdfFile) return;

    setSubmitting(true);
    setError(null);
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < uint8.length; i += 8192) {
        binary += String.fromCharCode(...uint8.subarray(i, i + 8192));
      }
      const pdfBase64 = btoa(binary);

      const res = await fetch("/api/pdfs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, code, jurisdiction, pdfBase64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to add PDF");
      onSuccess(data.id);
    } catch (err) {
      setError(err.message);
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
            {/* File drop zone */}
            <button
              type="button"
              className={`drop-zone ${pdfFile ? "has-file" : ""}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload PDF"
            >
              {pdfFile ? (
                <span className="drop-zone-filename">{pdfFile.name}</span>
              ) : (
                <span className="drop-zone-hint">
                  Drop a PDF here, or click to browse
                </span>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={handleFileChange}
              />
            </button>
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
            <div className="form-field">
              <label className="form-label" htmlFor="jurisdiction-input">
                Jurisdiction
              </label>
              <select
                id="jurisdiction-input"
                className="form-select"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                required
              >
                <option value="">Select…</option>
                {jurisdictions.map((j) => (
                  <option key={j.abbreviation} value={j.abbreviation}>
                    {j.name}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="modal-actions">
              <Button type="button" className="btn" onPress={onClose}>
                Cancel
              </Button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || !title || !jurisdiction || !pdfFile}
              >
                {submitting ? "Creating…" : "Create"}
              </button>
            </div>
          </form>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
