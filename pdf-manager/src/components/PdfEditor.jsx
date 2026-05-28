import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DiffBanner } from "./DiffBanner.jsx";
import { FieldList } from "./FieldList.jsx";
import { FieldMapper } from "./FieldMapper.jsx";
import { PdfCanvas } from "./PdfCanvas.jsx";

async function fileToBase64(file) {
  const arrayBuffer = await file.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < uint8.length; i += 8192) {
    binary += String.fromCharCode(...uint8.subarray(i, i + 8192));
  }
  return btoa(binary);
}

export function PdfEditor({ pdfId, onFieldsChanged }) {
  const [meta, setMeta] = useState(null);
  const [fields, setFields] = useState([]);
  const [stagedRenames, setStagedRenames] = useState({});
  const [stagedDeletes, setStagedDeletes] = useState(new Set());
  const [highlightedField, setHighlightedField] = useState(null);
  const [hoveredField, setHoveredField] = useState(null);
  const [diff, setDiff] = useState(null);
  const [saving, setSaving] = useState(false);

  // Upload New Version state
  const fileInputRef = useRef(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [pdfBase64, setPdfBase64] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const loadFields = useCallback(async () => {
    const [fieldsRes, pdfsRes] = await Promise.all([
      fetch(`/api/pdf/${pdfId}/fields`),
      fetch("/api/pdfs"),
    ]);
    const [newFields, allPdfs] = await Promise.all([
      fieldsRes.json(),
      pdfsRes.json(),
    ]);
    setFields(newFields);
    setMeta(allPdfs.find((p) => p.id === pdfId) ?? null);
  }, [pdfId]);

  useEffect(() => {
    loadFields();
  }, [loadFields]);

  // Auto-trigger preview when a file is selected
  useEffect(() => {
    if (!uploadFile) return;
    let cancelled = false;
    async function runPreview() {
      setUploading(true);
      setUploadError(null);
      try {
        const base64 = await fileToBase64(uploadFile);
        if (cancelled) return;
        const res = await fetch(`/api/pdf/${pdfId}/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdfBase64: base64 }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) throw new Error(data.error ?? "Failed to load preview");
        setPdfBase64(base64);
        setPreview(data);
      } catch (err) {
        if (!cancelled) setUploadError(err.message);
      } finally {
        if (!cancelled) setUploading(false);
      }
    }
    runPreview();
    return () => {
      cancelled = true;
    };
  }, [uploadFile, pdfId]);

  async function commit(renames, deletes) {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/pdf/${pdfId}/fields`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ renames, deletes }),
      });
      const result = await res.json();
      setStagedRenames({});
      setStagedDeletes(new Set());
      setDiff(result);
      await loadFields();
      onFieldsChanged?.();
    } finally {
      setSaving(false);
    }
  }

  const persistedExcludes = useMemo(
    () => new Set(fields.filter((f) => f.excluded).map((f) => f.name)),
    [fields],
  );

  const allExcluded = useMemo(
    () => new Set([...persistedExcludes, ...stagedDeletes]),
    [persistedExcludes, stagedDeletes],
  );

  async function handleSave() {
    const renames = Object.entries(stagedRenames).map(([from, to]) => ({
      from,
      to,
    }));
    const deletes = [...stagedDeletes];
    if (renames.length === 0 && deletes.length === 0) return;
    await commit(renames, deletes);
  }

  function handleRename(originalName, newName) {
    setStagedRenames((prev) => {
      if (newName === originalName) {
        const next = { ...prev };
        delete next[originalName];
        return next;
      }
      return { ...prev, [originalName]: newName };
    });
  }

  function handleDelete(fieldName) {
    if (stagedDeletes.has(fieldName)) {
      setStagedDeletes((prev) => {
        const next = new Set(prev);
        next.delete(fieldName);
        return next;
      });
      return;
    }
    if (persistedExcludes.has(fieldName)) return;
    setStagedDeletes((prev) => new Set([...prev, fieldName]));
    setStagedRenames((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  }

  function handleUploadClick() {
    setUploadFile(null);
    setPdfBase64(null);
    setPreview(null);
    setUploadError(null);
    fileInputRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) setUploadFile(file);
    e.target.value = "";
  }

  const hasChanges =
    Object.keys(stagedRenames).length > 0 || stagedDeletes.size > 0;

  if (preview) {
    return (
      <FieldMapper
        pdfId={pdfId}
        fileName={uploadFile?.name}
        pdfBase64={pdfBase64}
        preview={preview}
        onClose={() => {
          setPreview(null);
          setPdfBase64(null);
          setUploadFile(null);
        }}
        onSuccess={async (result) => {
          setPreview(null);
          setPdfBase64(null);
          setUploadFile(null);
          setDiff(result);
          await loadFields();
          onFieldsChanged?.();
        }}
      />
    );
  }

  return (
    <div className="pdf-manager">
      <div className="editor-toolbar">
        <div className="editor-meta">
          <h2 className="editor-title">{meta?.title ?? pdfId}</h2>
          {meta?.code && <span className="meta-code">{meta.code}</span>}
          {meta?.jurisdiction && (
            <span className="meta-jurisdiction">{meta.jurisdiction}</span>
          )}
        </div>
        <div className="editor-actions">
          {uploadError && (
            <span className="upload-error-inline">{uploadError}</span>
          )}
          <button
            type="button"
            className="btn btn-sm"
            onClick={handleUploadClick}
            disabled={uploading}
          >
            {uploading ? "Loading…" : "Upload New Version"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="sr-only"
            onChange={handleFileChange}
          />
          <button
            type="button"
            className={`btn btn-primary btn-sm ${!hasChanges ? "btn-disabled" : ""}`}
            onClick={handleSave}
            disabled={!hasChanges || saving}
            title="Save changes (s)"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {diff && <DiffBanner diff={diff} onDismiss={() => setDiff(null)} />}

      <div className="editor-body">
        <PdfCanvas
          pdfUrl={`/api/pdf/${pdfId}/bytes`}
          highlightedField={highlightedField}
          hoveredField={hoveredField}
          onFieldClick={setHighlightedField}
        />
        <FieldList
          fields={fields}
          stagedRenames={stagedRenames}
          excludedFields={allExcluded}
          onHighlight={setHighlightedField}
          onHoverField={setHoveredField}
          highlightedField={highlightedField}
          onRename={handleRename}
          onExclude={handleDelete}
        />
      </div>
    </div>
  );
}
