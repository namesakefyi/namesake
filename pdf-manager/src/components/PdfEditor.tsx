import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, FileTrigger } from "react-aria-components";
import type { Diff, Field, FieldPreview, PdfMeta, Rename } from "../types.ts";
import { fileToBase64 } from "../utils.ts";
import { DiffBanner } from "./DiffBanner.tsx";
import { FieldList } from "./FieldList.tsx";
import { FieldMapper } from "./FieldMapper.tsx";
import { PdfCanvas } from "./PdfCanvas.tsx";

interface PdfEditorProps {
  pdfId: string;
  onFieldsChanged?: () => void;
}

export function PdfEditor({ pdfId, onFieldsChanged }: PdfEditorProps) {
  const [meta, setMeta] = useState<PdfMeta | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [stagedRenames, setStagedRenames] = useState<Record<string, string>>(
    {},
  );
  const [stagedDeletes, setStagedDeletes] = useState(new Set<string>());
  const [highlightedField, setHighlightedField] = useState<string | null>(null);
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [diff, setDiff] = useState<Diff | null>(null);
  const [saving, setSaving] = useState(false);

  // Upload New Version state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [preview, setPreview] = useState<FieldPreview | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const loadFields = useCallback(async () => {
    const res = await fetch(`/api/pdf/${pdfId}/fields`);
    setFields(await res.json());
  }, [pdfId]);

  useEffect(() => {
    loadFields();
  }, [loadFields]);

  useEffect(() => {
    let cancelled = false;
    async function fetchMeta() {
      const res = await fetch("/api/pdfs");
      const allPdfs = await res.json<PdfMeta[]>();
      if (!cancelled) setMeta(allPdfs.find((p) => p.id === pdfId) ?? null);
    }
    fetchMeta();
    return () => {
      cancelled = true;
    };
  }, [pdfId]);

  // Auto-trigger preview when a file is selected
  useEffect(() => {
    if (!uploadFile) return;
    const file = uploadFile;
    let cancelled = false;
    async function runPreview() {
      setUploading(true);
      setUploadError(null);
      try {
        const base64 = await fileToBase64(file);
        if (cancelled) return;
        const res = await fetch(`/api/pdf/${pdfId}/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdfBase64: base64 }),
        });
        const data = await res.json<FieldPreview>();
        if (cancelled) return;
        if (!res.ok) throw new Error(data.error ?? "Failed to load preview");
        const preview = data;
        setPdfBase64(base64);
        setPreview(preview);
      } catch (err) {
        if (!cancelled)
          setUploadError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setUploading(false);
      }
    }
    runPreview();
    return () => {
      cancelled = true;
    };
  }, [uploadFile, pdfId]);

  async function commit(renames: Rename[], deletes: string[]) {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/pdf/${pdfId}/fields`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ renames, deletes }),
      });
      const result = await res.json<Diff>();
      if (!res.ok) throw new Error(result.error ?? "Save failed");
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

  function handleRename(originalName: string, newName: string) {
    setStagedRenames((prev) => {
      if (newName === originalName) {
        const next = { ...prev };
        delete next[originalName];
        return next;
      }
      return { ...prev, [originalName]: newName };
    });
  }

  function handleDelete(fieldName: string) {
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

  const hasChanges =
    Object.keys(stagedRenames).length > 0 || stagedDeletes.size > 0;

  if (preview && pdfBase64) {
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
          <FileTrigger
            acceptedFileTypes={[".pdf"]}
            onSelect={(fl) => {
              if (!fl?.[0]) return;
              setUploadFile(null);
              setPdfBase64(null);
              setPreview(null);
              setUploadError(null);
              setUploadFile(fl[0]);
            }}
          >
            <Button
              className="btn btn-sm"
              isPending={uploading}
              isDisabled={uploading}
            >
              {({ isPending }) =>
                isPending ? "Loading…" : "Upload New Version"
              }
            </Button>
          </FileTrigger>
          <button
            type="button"
            className="btn btn-primary btn-sm"
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
