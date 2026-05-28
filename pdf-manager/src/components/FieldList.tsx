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
  isRenaming?: boolean;
  onStartRename?: (name: string) => void;
  onConfirmRename?: (name: string) => void;
  onCancelRename?: () => void;
  onHoverField?: (name: string | null) => void;
  variant?: FieldVariant;
}

export function FieldItem({
  field,
  displayName,
  isRenaming,
  onStartRename,
  onConfirmRename,
  onCancelRename,
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
      onMouseEnter={() => onHoverField?.(field.name)}
      onDoubleClick={(e) => {
        e.preventDefault();
        onStartRename?.(field.name);
      }}
    >
      <FieldTypeIcon type={field.type} />
      <span className="field-name" title={field.name}>
        {displayName}
      </span>
      {isRenaming && onConfirmRename && onCancelRename && (
        <RenameInput
          currentName={displayName}
          onConfirm={onConfirmRename}
          onCancel={onCancelRename}
        />
      )}
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
  const listRef = useRef<HTMLDivElement>(null);

  const focusList = () => setTimeout(() => listRef.current?.focus(), 0);

  const startRename = useCallback((fieldName: string) => {
    setRenamingField(fieldName);
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
              isRenaming={renamingField === field.name}
              onStartRename={startRename}
              onConfirmRename={confirmRename}
              onCancelRename={() => {
                setRenamingField(null);
                focusList();
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
    </div>
  );
}
