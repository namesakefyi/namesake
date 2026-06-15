import { RiAddLine, RiDeleteBinLine } from "@remixicon/react";
import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { FieldName, FormData } from "~/constants/fields";
import { Button } from "../../common/Button";
import "./RepeatingEntry.css";

type ArrayFieldName = {
  [K in FieldName]: FormData[K] extends string[] ? K : never;
}[FieldName];

export interface RepeatingEntryProps {
  /** The array field name to store all entries. */
  name: ArrayFieldName;

  /**
   * Minimum number of visible instances.
   * @default 1
   */
  min?: number;

  /** Maximum number of visible instances. */
  max?: number;

  /**
   * Number of slots shown on first render when the field has no saved data.
   * @default min.
   */
  defaultCount?: number;

  /** Render function called for each visible instance. */
  children: (
    value: string,
    onChange: (val: string) => void,
    index: number,
  ) => React.ReactNode;
}

export function RepeatingEntry({
  name,
  min = 1,
  max,
  defaultCount,
  children,
}: RepeatingEntryProps) {
  const { watch, setValue } = useFormContext<FormData>();
  const raw = watch(name) ?? [];

  const [count, setCount] = useState(() =>
    Math.max(raw.length, defaultCount ?? min),
  );

  // Pad raw data with empty strings up to count so every slot has a value.
  const values = Array.from({ length: count }, (_, i) => raw[i] ?? "");

  const keys = useRef<string[]>([]);
  while (keys.current.length < count) {
    keys.current.push(crypto.randomUUID());
  }

  const handleChange = (index: number, val: string) => {
    // Extend raw if the changed index is beyond its current length.
    const next = Array.from(
      { length: Math.max(raw.length, index + 1) },
      (_, i) => raw[i] ?? "",
    );
    next[index] = val;
    setValue(name, next);
  };

  const handleAdd = () => {
    setCount((c) => (max === undefined ? c + 1 : Math.min(c + 1, max)));
  };

  const handleRemove = () => {
    keys.current = keys.current.slice(0, -1);
    setValue(name, raw.slice(0, count - 1));
    setCount((c) => Math.max(c - 1, min));
  };

  const canAdd = max === undefined || count < max;
  const canRemove = count > min;

  return (
    <div className="repeating-entry">
      {values.map((value, index) => (
        <div key={keys.current[index]} className="repeating-entry-item">
          {children(value, (val) => handleChange(index, val), index)}
          {canRemove && index === count - 1 && (
            <Button
              type="button"
              variant="secondary"
              icon={RiDeleteBinLine}
              className="repeating-entry-remove"
              onPress={handleRemove}
              aria-label="Remove"
            />
          )}
        </div>
      ))}
      {canAdd && (
        <Button
          type="button"
          variant="secondary"
          icon={RiAddLine}
          className="repeating-entry-add"
          onPress={handleAdd}
        >
          Add
        </Button>
      )}
    </div>
  );
}
