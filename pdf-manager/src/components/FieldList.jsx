import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Dialog,
  ListBox,
  ListBoxItem,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { createPortal } from "react-dom";

function RenameOverlay({
  fieldName,
  currentName,
  listRef,
  onConfirm,
  onCancel,
}) {
  const [value, setValue] = useState(currentName);
  const [rect, setRect] = useState(null);
  const inputRef = useRef(null);

  useLayoutEffect(() => {
    const inner = Array.from(
      listRef.current?.querySelectorAll("[data-field-id]") ?? [],
    ).find((el) => el.dataset.fieldId === fieldName);
    const li = inner?.closest("[role='option']");
    if (li) setRect(li.getBoundingClientRect());
  }, [fieldName, listRef]);

  useLayoutEffect(() => {
    if (!rect || !inputRef.current) return;
    inputRef.current.focus();
    inputRef.current.select();
  }, [rect]);

  if (!rect) return null;

  return createPortal(
    <input
      ref={inputRef}
      className="rename-overlay-input"
      style={{ left: rect.left, top: rect.top, width: rect.width }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onConfirm(value.trim());
        }
        if (e.key === "Escape") {
          e.preventDefault();
          onCancel();
        }
      }}
      onBlur={onCancel}
    />,
    document.body,
  );
}

function DeleteConfirmDialog({ fieldName, onConfirm, onCancel }) {
  return (
    <ModalOverlay
      className="modal-overlay"
      isOpen
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <Modal className="modal modal-sm">
        <Dialog aria-labelledby="delete-dialog-title">
          <h2 id="delete-dialog-title" className="modal-title">
            Delete field?
          </h2>
          <p className="modal-description">
            <code className="field-name-code">{fieldName}</code> will be removed
            from the PDF. You can discard this change by closing without saving.
          </p>
          <div className="modal-actions">
            <Button className="btn" onPress={onCancel} autoFocus>
              Cancel
            </Button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

function ContextMenu({ x, y, onRename, onDelete, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    menuRef.current?.querySelector("button")?.focus();
    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    }
    function onMouseDown(e) {
      if (!menuRef.current?.contains(e.target)) onClose();
    }
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ left: x, top: y }}
      role="menu"
      onKeyDown={(e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          e.currentTarget.querySelectorAll("button")[1]?.focus();
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          e.currentTarget.querySelectorAll("button")[0]?.focus();
        }
      }}
    >
      <button
        type="button"
        className="context-menu-item"
        role="menuitem"
        onClick={onRename}
      >
        Rename
      </button>
      <button
        type="button"
        className="context-menu-item context-menu-danger"
        role="menuitem"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
}

function FieldTypeIcon({ type }) {
  if (type === "checkbox") {
    return (
      <svg
        className="field-type-icon"
        viewBox="0 0 12 12"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="2,6.5 4.5,10 9.5,1.5" />
      </svg>
    );
  }
  return (
    <svg
      className="field-type-icon"
      viewBox="0 0 12 12"
      width="12"
      height="12"
      aria-hidden="true"
    >
      <line
        x1="1.5"
        y1="2"
        x2="10.5"
        y2="2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
      <line
        x1="1.5"
        y1="2"
        x2="1.5"
        y2="3.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
      <line
        x1="10.5"
        y1="2"
        x2="10.5"
        y2="3.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
      <line
        x1="6"
        y1="2"
        x2="6"
        y2="10.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
      <line
        x1="4"
        y1="10.5"
        x2="8"
        y2="10.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function FieldItem({
  field,
  displayName,
  onStartRename,
  onContextMenu,
  onHoverField,
  variant,
}) {
  const resolvedVariant =
    variant ?? (displayName !== field.name ? "new" : undefined);

  return (
    <ListBoxItem
      id={field.name}
      textValue={displayName}
      className="field-item"
      data-variant={resolvedVariant}
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: double-click and right-click interactions */}
      <div
        className="field-item-inner"
        data-field-id={field.name}
        onMouseEnter={() => onHoverField?.(field.name)}
        onDoubleClick={(e) => {
          e.preventDefault();
          onStartRename?.(field.name);
        }}
        onContextMenu={
          onContextMenu
            ? (e) => {
                e.preventDefault();
                onContextMenu(field.name, e.clientX, e.clientY);
              }
            : undefined
        }
      >
        <FieldTypeIcon type={field.type} />
        <span className="field-name" title={field.name}>
          {displayName}
        </span>
      </div>
    </ListBoxItem>
  );
}

export function FieldList({
  fields,
  stagedRenames,
  highlightedField,
  onHighlight,
  onHoverField,
  onRename,
  onDelete,
}) {
  const [renamingField, setRenamingField] = useState(null);
  const [deletingField, setDeletingField] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const listRef = useRef(null);

  const focusList = () => setTimeout(() => listRef.current?.focus(), 0);

  const startRename = useCallback((fieldName) => {
    setRenamingField(fieldName);
    setDeletingField(null);
    setContextMenu(null);
  }, []);

  const startDelete = useCallback((fieldName) => {
    setDeletingField(fieldName);
    setContextMenu(null);
  }, []);

  function confirmRename(newName) {
    if (renamingField && newName && newName !== renamingField)
      onRename(renamingField, newName);
    setRenamingField(null);
    focusList();
  }

  function confirmDelete() {
    if (deletingField) onDelete(deletingField);
    setDeletingField(null);
    focusList();
  }

  // Capture phase so Delete/Backspace/Enter reach us before RAC's type-ahead and activation handlers.
  useEffect(() => {
    function onKeyDown(e) {
      if (!listRef.current?.contains(document.activeElement)) return;
      if (renamingField || contextMenu) return;
      if ((e.key === "Delete" || e.key === "Backspace") && highlightedField) {
        e.preventDefault();
        e.stopPropagation();
        startDelete(highlightedField);
      } else if (e.key === "Enter" && highlightedField) {
        e.preventDefault();
        e.stopPropagation();
        startRename(highlightedField);
      }
    }
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [highlightedField, renamingField, contextMenu, startDelete, startRename]);

  useEffect(() => {
    if (!highlightedField || !listRef.current) return;
    const item = listRef.current.querySelector('[aria-selected="true"]');
    if (!item) return;
    const { top: lt, bottom: lb } = listRef.current.getBoundingClientRect();
    const { top: it, bottom: ib } = item.getBoundingClientRect();
    if (it < lt || ib > lb) item.scrollIntoView({ block: "nearest" });
  }, [highlightedField]);

  return (
    <div className="field-panel">
      <div className="field-panel-header">
        <span className="field-count">{fields.length} fields</span>
      </div>
      <ListBox
        ref={listRef}
        aria-label="PDF fields"
        className="field-list"
        selectionMode="single"
        selectionBehavior="replace"
        selectedKeys={
          highlightedField ? new Set([highlightedField]) : new Set()
        }
        onMouseLeave={() => onHoverField?.(null)}
        onSelectionChange={(keys) => {
          const name = [...keys][0];
          if (name) onHighlight(name);
          if (renamingField && name !== renamingField) setRenamingField(null);
        }}
      >
        {fields.map((field) => (
          <FieldItem
            key={field.name}
            field={field}
            displayName={stagedRenames[field.name] ?? field.name}
            onStartRename={startRename}
            onContextMenu={(name, x, y) => {
              onHighlight(name);
              setContextMenu({ fieldName: name, x, y });
            }}
            onHoverField={onHoverField}
          />
        ))}
      </ListBox>

      {renamingField && (
        <RenameOverlay
          fieldName={renamingField}
          currentName={stagedRenames[renamingField] ?? renamingField}
          listRef={listRef}
          onConfirm={confirmRename}
          onCancel={() => {
            setRenamingField(null);
            focusList();
          }}
        />
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onRename={() => startRename(contextMenu.fieldName)}
          onDelete={() => startDelete(contextMenu.fieldName)}
          onClose={() => {
            setContextMenu(null);
            focusList();
          }}
        />
      )}

      {deletingField && (
        <DeleteConfirmDialog
          fieldName={deletingField}
          onConfirm={confirmDelete}
          onCancel={() => {
            setDeletingField(null);
            focusList();
          }}
        />
      )}
    </div>
  );
}
