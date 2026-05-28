import type { RefObject } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  ListBox,
  ListBoxItem,
  Menu,
  MenuItem,
  Popover,
} from "react-aria-components";
import { createPortal } from "react-dom";
import { useFieldRowRect, useScrollSelectedIntoView } from "../hooks.ts";
import type { Field } from "../types.ts";

interface RenameOverlayProps {
  fieldName: string;
  currentName: string;
  listRef: RefObject<HTMLElement | null>;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

function RenameOverlay({
  fieldName,
  currentName,
  listRef,
  onConfirm,
  onCancel,
}: RenameOverlayProps) {
  const [value, setValue] = useState(currentName);
  const inputRef = useRef<HTMLInputElement>(null);
  const rect = useFieldRowRect(fieldName, listRef);

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

interface ContextMenuProps {
  x: number;
  y: number;
  onRename: () => void;
  onExclude: () => void;
  onClose: () => void;
}

function ContextMenu({ x, y, onRename, onExclude, onClose }: ContextMenuProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <div ref={triggerRef} style={{ position: "fixed", left: x, top: y }} />
      <Popover
        triggerRef={triggerRef}
        isOpen
        onOpenChange={(open) => !open && onClose()}
        placement="bottom start"
        className="context-menu"
      >
        <Menu
          autoFocus="first"
          onAction={(key) => {
            if (key === "rename") onRename();
            else if (key === "exclude") onExclude();
          }}
        >
          <MenuItem id="rename" className="context-menu-item">
            Rename
          </MenuItem>
          <MenuItem id="exclude" className="context-menu-item">
            Exclude
          </MenuItem>
        </Menu>
      </Popover>
    </>
  );
}

function FieldTypeIcon({ type }: { type: Field["type"] }) {
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

type FieldVariant = "new" | "excluded" | "normal" | "created";

export interface FieldItemProps {
  field: Field;
  displayName: string;
  onStartRename?: (name: string) => void;
  onContextMenu?: (name: string, x: number, y: number) => void;
  onHoverField?: (name: string | null) => void;
  variant?: FieldVariant;
}

export function FieldItem({
  field,
  displayName,
  onStartRename,
  onContextMenu,
  onHoverField,
  variant,
}: FieldItemProps) {
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

interface ContextMenuState {
  fieldName: string;
  x: number;
  y: number;
}

export interface FieldListProps {
  fields: Field[];
  stagedRenames: Record<string, string>;
  excludedFields?: Set<string>;
  highlightedField: string | null;
  onHighlight: (name: string) => void;
  onHoverField?: (name: string | null) => void;
  onRename: (original: string, newName: string) => void;
  onExclude: (name: string) => void;
}

export function FieldList({
  fields,
  stagedRenames,
  excludedFields = new Set(),
  highlightedField,
  onHighlight,
  onHoverField,
  onRename,
  onExclude,
}: FieldListProps) {
  const [renamingField, setRenamingField] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const focusList = () => setTimeout(() => listRef.current?.focus(), 0);

  const startRename = useCallback((fieldName: string) => {
    setRenamingField(fieldName);
    setContextMenu(null);
  }, []);

  function confirmRename(newName: string) {
    if (renamingField && newName) onRename(renamingField, newName);
    setRenamingField(null);
    focusList();
  }

  // Capture phase so Delete/Backspace/Enter reach us before RAC's type-ahead and activation handlers.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!listRef.current?.contains(document.activeElement)) return;
      if (renamingField || contextMenu) return;
      if ((e.key === "Delete" || e.key === "Backspace") && highlightedField) {
        e.preventDefault();
        e.stopPropagation();
        onExclude(highlightedField);
      } else if (
        e.key === "Enter" &&
        highlightedField &&
        !excludedFields.has(highlightedField)
      ) {
        e.preventDefault();
        e.stopPropagation();
        startRename(highlightedField);
      }
    }
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [
    highlightedField,
    renamingField,
    contextMenu,
    onExclude,
    startRename,
    excludedFields,
  ]);

  useScrollSelectedIntoView(highlightedField, listRef);

  const activeList = fields.filter((f) => !excludedFields.has(f.name));
  const excludedList = fields.filter((f) => excludedFields.has(f.name));

  return (
    <div className="field-panel">
      <div className="field-panel-header">
        <span className="field-count">{activeList.length} fields</span>
        {excludedList.length > 0 && (
          <span className="field-count-excluded">
            {excludedList.length} excluded
          </span>
        )}
      </div>
      <div className="field-scroll-area">
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
            if (name) onHighlight(String(name));
            if (renamingField && name !== renamingField) setRenamingField(null);
          }}
        >
          {activeList.map((field) => (
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

        {excludedList.length > 0 && (
          <div className="field-excluded-group">
            <div className="field-section-label">Excluded</div>
            <ListBox
              aria-label="Excluded fields"
              className="field-list field-list-excluded"
              selectionMode="single"
              selectionBehavior="replace"
              selectedKeys={
                highlightedField ? new Set([highlightedField]) : new Set()
              }
              onMouseLeave={() => onHoverField?.(null)}
              onSelectionChange={(keys) => {
                const name = [...keys][0];
                if (name) onHighlight(String(name));
              }}
            >
              {excludedList.map((field) => (
                <FieldItem
                  key={field.name}
                  field={field}
                  displayName={stagedRenames[field.name] ?? field.name}
                  variant="excluded"
                  onHoverField={onHoverField}
                />
              ))}
            </ListBox>
          </div>
        )}
      </div>

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
          onExclude={() => {
            onExclude(contextMenu.fieldName);
            setContextMenu(null);
            focusList();
          }}
          onClose={() => {
            setContextMenu(null);
            focusList();
          }}
        />
      )}
    </div>
  );
}
