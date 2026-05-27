import { useCallback, useEffect, useState } from "react";
import { AddPdfModal } from "./components/AddPdfModal.jsx";
import { PdfEditor } from "./components/PdfEditor.jsx";
import { PdfList } from "./components/PdfList.jsx";

export function App() {
  const [pdfs, setPdfs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [addPdfOpen, setAddPdfOpen] = useState(false);

  const loadPdfs = useCallback(async () => {
    const res = await fetch("/api/pdfs");
    setPdfs(await res.json());
  }, []);

  useEffect(() => {
    loadPdfs();
  }, [loadPdfs]);

  function handlePdfAdded(id) {
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
            onFieldsChanged={() => loadPdfs()}
          />
        ) : (
          <div className="empty-state">
            <p>Select a PDF to edit</p>
            <p className="hint">↑↓ to navigate · Enter to open</p>
          </div>
        )}
      </main>

      {addPdfOpen && (
        <AddPdfModal
          onClose={() => setAddPdfOpen(false)}
          onSuccess={handlePdfAdded}
        />
      )}
    </div>
  );
}
