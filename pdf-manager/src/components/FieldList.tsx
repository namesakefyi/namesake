import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ListBox, ListBoxItem } from "react-aria-components";
import { useScrollSelectedIntoView } from "../hooks.ts";
import type { Field } from "../types.ts";

function RenameInput({
  currentName,
  onConfirm,
  onCancel,
}: {
  currentName: string;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(currentName);
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  return (
    <input
      ref={inputRef}
      id="rename-field-input"
      className="rename-overlay-input"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        e.stopPropagation();
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
    />
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
  onHoverField?: (name: string | null) => void;
  variant?: FieldVariant;
}

export function FieldItem({
  field,
  displayName,
  onStartRename,
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
      data-field-id={field.name}
      onHoverStart={() => onHoverField?.(field.name)}
      onHoverEnd={() => onHoverField?.(null)}
      onDoubleClick={(e) => {
        e.preventDefault();
        onStartRename?.(field.name);
      }}
    >
      <FieldTypeIcon type={field.type} />
      <span className="field-name" title={field.name}>
        {displayName}
      </span>
    </ListBoxItem>
  );
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
  const [renameRect, setRenameRect] = useState<{
    top: number;
    height: number;
  } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const focusList = () => setTimeout(() => listRef.current?.focus(), 0);

  const startRename = useCallback((fieldName: string) => {
    setRenamingField(fieldName);
  }, []);

  function confirmRename(newName: string) {
    if (renamingField && newName) onRename(renamingField, newName);
    setRenamingField(null);
    focusList();
  }

  // Measure the renaming item's position within the scroll area so the input
  // can be rendered as a sibling of ListBox (outside its DOM subtree) while
  // still appearing directly over the item.
  useLayoutEffect(() => {
    if (!renamingField) {
      setRenameRect(null);
      return;
    }
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;
    const el = Array.from(scrollArea.querySelectorAll("[data-field-id]")).find(
      (el) => el.getAttribute("data-field-id") === renamingField,
    );
    if (!el) return;
    const containerRect = scrollArea.getBoundingClientRect();
    const itemRect = el.getBoundingClientRect();
    setRenameRect({
      top: itemRect.top - containerRect.top + scrollArea.scrollTop,
      height: itemRect.height,
    });
  }, [renamingField]);

  // Capture phase so Delete/Backspace/Enter reach us before RAC's type-ahead and activation handlers.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!listRef.current?.contains(document.activeElement)) return;
      if (renamingField) return;
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
  }, [highlightedField, renamingField, onExclude, startRename, excludedFields]);

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
      <div ref={scrollAreaRef} className="field-scroll-area">
        <ListBox
          ref={listRef}
          aria-label="PDF fields"
          className="field-list"
          selectionMode="single"
          selectionBehavior="replace"
          selectedKeys={
            highlightedField ? new Set([highlightedField]) : new Set()
          }
          onSelectionChange={(keys) => {
            if (renamingField) return;
            const name = [...keys][0];
            if (name) onHighlight(String(name));
          }}
        >
          {activeList.map((field) => (
            <FieldItem
              key={field.name}
              field={field}
              displayName={stagedRenames[field.name] ?? field.name}
              onStartRename={startRename}
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

        {renamingField && renameRect && (
          <div
            style={{
              position: "absolute",
              top: renameRect.top,
              left: 0,
              right: 0,
              height: renameRect.height,
            }}
          >
            <RenameInput
              currentName={stagedRenames[renamingField] ?? renamingField}
              onConfirm={confirmRename}
              onCancel={() => {
                setRenamingField(null);
                focusList();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
