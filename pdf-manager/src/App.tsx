import { useCallback, useEffect, useState } from "react";
import { AddPdfModal } from "./components/AddPdfModal.tsx";
import { PdfEditor } from "./components/PdfEditor.tsx";
import { PdfList } from "./components/PdfList.tsx";
import type { PdfMeta } from "./types.ts";

export function App() {
  const [pdfs, setPdfs] = useState<PdfMeta[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addPdfOpen, setAddPdfOpen] = useState(false);

  const loadPdfs = useCallback(async () => {
    const res = await fetch("/api/pdfs");
    setPdfs(await res.json());
  }, []);

  useEffect(() => {
    loadPdfs();
  }, [loadPdfs]);

  function handlePdfAdded(id: string) {
    loadPdfs();
    setSelectedId(id);
    setAddPdfOpen(false);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">PDF Manager</h1>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => setAddPdfOpen(true)}
          >
            Add PDF
          </button>
        </div>
        <PdfList pdfs={pdfs} selectedId={selectedId} onSelect={setSelectedId} />
      </aside>

      <main className="editor-panel">
        {selectedId ? (
          <PdfEditor
            key={selectedId}
            pdfId={selectedId}
            onFieldsChanged={loadPdfs}
          />
        ) : (
          <div className="empty-state">
            <p>Select a PDF to edit</p>
            <p className="hint">↑↓ to navigate · Enter to open</p>
          </div>
        )}
      </main>

      <AddPdfModal
        isOpen={addPdfOpen}
        onClose={() => setAddPdfOpen(false)}
        onSuccess={handlePdfAdded}
      />
    </div>
  );
}
