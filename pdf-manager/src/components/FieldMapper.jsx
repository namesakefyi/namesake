import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ListBox } from "react-aria-components";
import { createPortal } from "react-dom";
import { FieldItem } from "./FieldList.jsx";
import { PdfCanvas } from "./PdfCanvas.jsx";

function AssignOverlay({
  rawName,
  currentValue,
  listRef,
  available,
  onConfirm,
  onCancel,
}) {
  const [value, setValue] = useState(currentValue);
  const [filterText, setFilterText] = useState("");
  const [rect, setRect] = useState(null);
  const [activeIdx, setActiveIdx] = useState(-1);
  const closedRef = useRef(false);
  const inputRef = useRef(null);

  useLayoutEffect(() => {
    const inner = Array.from(
      listRef.current?.querySelectorAll("[data-field-id]") ?? [],
    ).find((el) => el.dataset.fieldId === rawName);
    const li = inner?.closest("[role='option']");
    if (li) setRect(li.getBoundingClientRect());
  }, [rawName, listRef]);

  useLayoutEffect(() => {
    if (!rect || !inputRef.current) return;
    inputRef.current.focus();
    inputRef.current.select();
  }, [rect]);

  if (!rect) return null;

  const suggestions = available.filter((n) =>
    n.toLowerCase().includes(filterText.toLowerCase()),
  );

  function close(confirm) {
    if (closedRef.current) return;
    closedRef.current = true;
    if (confirm && value.trim()) onConfirm(value.trim());
    else onCancel();
  }

  function selectSuggestion(name) {
    if (closedRef.current) return;
    closedRef.current = true;
    onConfirm(name);
  }

  return createPortal(
    <div
      className="fm-assign-overlay"
      style={{ left: rect.left, top: rect.top, width: rect.width }}
    >
      <input
        ref={inputRef}
        className="fm-assign-input"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setFilterText(e.target.value);
          setActiveIdx(-1);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIdx((i) => Math.max(i - 1, -1));
          } else if (e.key === "Enter") {
            e.preventDefault();
            activeIdx >= 0 && suggestions[activeIdx]
              ? selectSuggestion(suggestions[activeIdx])
              : close(true);
          } else if (e.key === "Escape") {
            e.preventDefault();
            close(false);
          }
        }}
        onBlur={() => close(true)}
      />
      {suggestions.length > 0 && (
        <div className="fm-suggestions">
          {suggestions.map((name, i) => (
            <button
              key={name}
              type="button"
              className={`fm-suggestion-item${i === activeIdx ? " active" : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                selectSuggestion(name);
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}

function UnresolvedPopover({
  wrapperRef,
  unclaimedNames,
  removedOld,
  onRemove,
  onUndo,
  onClose,
}) {
  const popoverRef = useRef(null);

  useEffect(() => {
    function onMouseDown(e) {
      if (
        !popoverRef.current?.contains(e.target) &&
        !wrapperRef.current?.contains(e.target)
      )
        onClose();
    }
    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    }
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [wrapperRef, onClose]);

  return (
    <div ref={popoverRef} className="fm-unresolved-popover">
      {unclaimedNames.length === 0 && removedOld.size === 0 ? (
        <div className="fm-popover-empty">All fields accounted for</div>
      ) : (
        <>
          {unclaimedNames.map((name) => (
            <div key={name} className="fm-popover-item">
              <span className="field-mapper-dot dot-unresolved" />
              <span className="field-mapper-name">{name}</span>
              <button
                type="button"
                className="field-mapper-action-btn field-mapper-remove-btn"
                onClick={() => onRemove(name)}
              >
                Remove
              </button>
            </div>
          ))}
          {[...removedOld].map((name) => (
            <div key={name} className="fm-popover-item">
              <span className="field-mapper-dot dot-removed" />
              <span className="field-mapper-name field-mapper-name-removed">
                {name}
              </span>
              <button
                type="button"
                className="field-mapper-action-btn field-mapper-undo-btn"
                onClick={() => onUndo(name)}
              >
                Undo
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export function FieldMapper({
  pdfId,
  fileName,
  pdfBase64,
  preview,
  onClose,
  onSuccess,
}) {
  const [assignments, setAssignments] = useState(() => {
    const a = {};
    for (const f of preview.newFields) {
      a[f.name] = preview.autoMappings?.[f.name] ?? f.name;
    }
    return a;
  });

  const [deletedFields, setDeletedFields] = useState(new Set());
  const [removedOld, setRemovedOld] = useState(new Set());
  const [_history, setHistory] = useState([]);
  const [showUnchanged, setShowUnchanged] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [highlightedField, setHighlightedField] = useState(null);
  const [hoveredField, setHoveredField] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const listRef = useRef(null);
  const badgeWrapperRef = useRef(null);

  const [newPdfUrl, setNewPdfUrl] = useState(null);
  useEffect(() => {
    const binary = atob(pdfBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const url = URL.createObjectURL(
      new Blob([bytes], { type: "application/pdf" }),
    );
    setNewPdfUrl(url);
    return () => {
      URL.revokeObjectURL(url);
      setNewPdfUrl(null);
    };
  }, [pdfBase64]);

  const retainedSet = useMemo(
    () => new Set(preview.retained),
    [preview.retained],
  );

  const activeFields = useMemo(
    () => preview.newFields.filter((f) => !retainedSet.has(f.name)),
    [preview.newFields, retainedSet],
  );

  const allOldNames = useMemo(
    () => [...preview.retained, ...preview.removed],
    [preview.retained, preview.removed],
  );

  const claimedOldNames = useMemo(
    () =>
      new Set(
        Object.entries(assignments)
          .filter(
            ([raw, v]) => !deletedFields.has(raw) && allOldNames.includes(v),
          )
          .map(([, v]) => v),
      ),
    [assignments, allOldNames, deletedFields],
  );

  const unclaimedOldNames = useMemo(
    () =>
      allOldNames.filter((n) => !claimedOldNames.has(n) && !removedOld.has(n)),
    [allOldNames, claimedOldNames, removedOld],
  );

  const unresolvedCount = unclaimedOldNames.length;

  useEffect(() => {
    if (unresolvedCount === 0 && removedOld.size === 0) setShowPopover(false);
  }, [unresolvedCount, removedOld.size]);

  const fieldColors = useMemo(() => {
    const colors = {};
    for (const f of preview.newFields) {
      if (deletedFields.has(f.name)) colors[f.name] = "rgba(232, 84, 84, 0.18)";
      else if (!retainedSet.has(f.name) && assignments[f.name] === f.name)
        colors[f.name] = "rgba(232, 168, 56, 0.18)";
    }
    return colors;
  }, [preview.newFields, assignments, retainedSet, deletedFields]);

  const pushUndo = useCallback(() => {
    setHistory((prev) => [
      ...prev,
      {
        assignments: { ...assignments },
        deletedFields: new Set(deletedFields),
        removedOld: new Set(removedOld),
      },
    ]);
  }, [assignments, deletedFields, removedOld]);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const snapshot = prev[prev.length - 1];
      setAssignments(snapshot.assignments);
      setDeletedFields(snapshot.deletedFields);
      setRemovedOld(snapshot.removedOld);
      return prev.slice(0, -1);
    });
  }, []);

  function setAssignment(rawName, value) {
    pushUndo();
    setAssignments((prev) => {
      const next = { ...prev };
      if (allOldNames.includes(value)) {
        for (const [k, v] of Object.entries(next)) {
          if (v === value && k !== rawName) next[k] = k;
        }
      }
      next[rawName] = value;
      return next;
    });
  }

  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        const active = document.activeElement;
        if (active?.tagName === "INPUT" || active?.tagName === "TEXTAREA")
          return;
        e.preventDefault();
        undo();
        return;
      }
      if (!listRef.current?.contains(document.activeElement)) return;
      if (editingField) return;
      if (
        e.key === "Enter" &&
        selectedKeys.size === 1 &&
        highlightedField &&
        !deletedFields.has(highlightedField)
      ) {
        e.preventDefault();
        e.stopPropagation();
        setEditingField(highlightedField);
      } else if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedKeys.size > 0
      ) {
        e.preventDefault();
        e.stopPropagation();
        const allDeleted = [...selectedKeys].every((k) => deletedFields.has(k));
        pushUndo();
        setDeletedFields((prev) => {
          const next = new Set(prev);
          for (const k of selectedKeys) {
            if (allDeleted) next.delete(k);
            else next.add(k);
          }
          return next;
        });
        if (!allDeleted) {
          setAssignments((prev) => {
            const next = { ...prev };
            for (const k of selectedKeys) next[k] = k;
            return next;
          });
        }
      }
    }
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [
    highlightedField,
    editingField,
    deletedFields,
    selectedKeys,
    undo,
    pushUndo,
  ]);

  useEffect(() => {
    if (!highlightedField || !listRef.current) return;
    const item = listRef.current.querySelector('[aria-selected="true"]');
    if (!item) return;
    const { top: lt, bottom: lb } = listRef.current.getBoundingClientRect();
    const { top: it, bottom: ib } = item.getBoundingClientRect();
    if (it < lt || ib > lb) item.scrollIntoView({ block: "nearest" });
  }, [highlightedField]);

  async function handleConfirm() {
    setSubmitting(true);
    setError(null);
    try {
      const renames = [];
      for (const [rawName, assignedName] of Object.entries(assignments)) {
        if (!deletedFields.has(rawName) && assignedName !== rawName)
          renames.push({ from: rawName, to: assignedName });
      }
      const res = await fetch(`/api/pdf/${pdfId}/file`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdfBase64,
          renames,
          deletes: [...deletedFields],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to replace PDF");
      onSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const editingAvailable = editingField
    ? allOldNames.filter(
        (n) => !claimedOldNames.has(n) || n === assignments[editingField],
      )
    : [];

  const activeFieldCount = preview.newFields.length - deletedFields.size;

  return (
    <div className="field-mapper">
      <div className="field-mapper-header">
        <span className="field-mapper-title">New revision</span>
        {fileName && <span className="meta-code">{fileName}</span>}
        <div className="field-mapper-spacer" />
        <span ref={badgeWrapperRef} style={{ position: "relative" }}>
          {unresolvedCount > 0 ? (
            <button
              type="button"
              className="field-mapper-badge field-mapper-badge-warn fm-badge-btn"
              onClick={() => setShowPopover((v) => !v)}
            >
              {unresolvedCount} unmapped
            </button>
          ) : (
            <span className="field-mapper-badge field-mapper-badge-ok">
              Ready
            </span>
          )}
          {showPopover && (
            <UnresolvedPopover
              wrapperRef={badgeWrapperRef}
              unclaimedNames={unclaimedOldNames}
              removedOld={removedOld}
              onRemove={(name) => {
                pushUndo();
                setRemovedOld((prev) => new Set([...prev, name]));
              }}
              onUndo={(name) => {
                pushUndo();
                setRemovedOld((prev) => {
                  const next = new Set(prev);
                  next.delete(name);
                  return next;
                });
              }}
              onClose={() => setShowPopover(false)}
            />
          )}
        </span>
        <button type="button" className="btn btn-sm" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleConfirm}
          disabled={submitting || unresolvedCount > 0}
        >
          {submitting ? "Replacing…" : "Replace"}
        </button>
      </div>

      {error && <div className="field-mapper-error">{error}</div>}

      <div className="field-mapper-body">
        <PdfCanvas
          pdfUrl={newPdfUrl}
          highlightedField={highlightedField}
          hoveredField={hoveredField}
          onFieldClick={(name) => {
            setHighlightedField(name);
            setSelectedKeys(new Set([name]));
          }}
          fieldColors={fieldColors}
          selectedFields={selectedKeys}
        />

        <div className="field-mapper-panel">
          {activeFields.length > 0 && (
            <>
              <div className="field-panel-header">
                <span className="field-count">{activeFieldCount} fields</span>
              </div>
              <ListBox
                ref={listRef}
                aria-label="New PDF fields"
                className="field-list"
                selectionMode="multiple"
                selectionBehavior="replace"
                selectedKeys={selectedKeys}
                onMouseLeave={() => setHoveredField(null)}
                onSelectionChange={(keys) => {
                  setSelectedKeys(keys);
                  const last = [...keys].at(-1) ?? null;
                  setHighlightedField(last);
                  if (editingField && !keys.has(editingField))
                    setEditingField(null);
                }}
              >
                {activeFields.map((f) => {
                  const assigned = assignments[f.name];
                  return (
                    <FieldItem
                      key={f.name}
                      field={f}
                      displayName={assigned}
                      variant={
                        deletedFields.has(f.name)
                          ? "deleted"
                          : assigned === f.name
                            ? "new"
                            : allOldNames.includes(assigned)
                              ? "normal"
                              : "created"
                      }
                      onStartRename={() => setEditingField(f.name)}
                      onHoverField={setHoveredField}
                    />
                  );
                })}
              </ListBox>
            </>
          )}

          {preview.retained.length > 0 && (
            <>
              <button
                type="button"
                className="field-mapper-unchanged-toggle"
                onClick={() => setShowUnchanged((v) => !v)}
                style={{ marginTop: activeFields.length > 0 ? 4 : 0 }}
              >
                <span className="field-mapper-toggle-arrow">
                  {showUnchanged ? "▾" : "▸"}
                </span>
                <span>{preview.retained.length} unchanged</span>
              </button>
              {showUnchanged &&
                preview.retained.map((name) => (
                  <div
                    key={name}
                    className="field-mapper-row field-mapper-row-retained"
                  >
                    <span className="field-mapper-dot dot-retained" />
                    <span className="field-mapper-name" title={name}>
                      {name}
                    </span>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>

      {editingField && (
        <AssignOverlay
          key={editingField}
          rawName={editingField}
          currentValue={assignments[editingField]}
          listRef={listRef}
          available={editingAvailable}
          onConfirm={(value) => {
            setAssignment(editingField, value);
            const currentIdx = activeFields.findIndex(
              (f) => f.name === editingField,
            );
            let next = null;
            for (let i = currentIdx + 1; i < activeFields.length; i++) {
              const f = activeFields[i];
              if (
                !deletedFields.has(f.name) &&
                assignments[f.name] === f.name
              ) {
                next = f.name;
                break;
              }
            }
            if (!next) {
              for (let i = 0; i < currentIdx; i++) {
                const f = activeFields[i];
                if (
                  !deletedFields.has(f.name) &&
                  assignments[f.name] === f.name
                ) {
                  next = f.name;
                  break;
                }
              }
            }
            if (next) {
              setHighlightedField(next);
              setSelectedKeys(new Set([next]));
              setEditingField(next);
            } else {
              setEditingField(null);
              setTimeout(() => listRef.current?.focus(), 0);
            }
          }}
          onCancel={() => {
            setEditingField(null);
            setTimeout(() => listRef.current?.focus(), 0);
          }}
        />
      )}
    </div>
  );
}
