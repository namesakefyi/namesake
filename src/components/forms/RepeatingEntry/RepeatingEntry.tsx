import { RiAddLine, RiDeleteBinLine } from "@remixicon/react";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import type { FieldName, FormData } from "../../../constants/fields";
import { Button } from "../../common/Button";
import "./RepeatingEntry.css";

type ArrayFieldName = {
  [K in FieldName]: FormData[K] extends string[] ? K : never;
}[FieldName];

export interface RepeatingEntryProps {
  /** The array field name to store all entries. */
  name: ArrayFieldName;
  /** Minimum number of visible instances. Default: 1 */
  min?: number;
  /** Maximum number of visible instances. */
  max?: number;
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
  children,
}: RepeatingEntryProps) {
  const { watch, setValue } = useFormContext<FormData>();
  const raw = watch(name) ?? [];
  const values =
    raw.length >= min ? raw : [...raw, ...Array(min - raw.length).fill("")];

  const keys = useRef<string[]>([]);
  while (keys.current.length < values.length) {
    keys.current.push(crypto.randomUUID());
  }

  const handleChange = (index: number, val: string) => {
    const next = [...values];
    next[index] = val;
    setValue(name, next);
  };

  const handleAdd = () => {
    setValue(name, [...values, ""]);
  };

  const handleRemove = () => {
    keys.current = keys.current.slice(0, -1);
    setValue(name, values.slice(0, -1));
  };

  const canAdd = max === undefined || values.length < max;
  const canRemove = values.length > min;

  return (
    <div className="repeating-entry">
      {values.map((value, index) => (
        <div key={keys.current[index]} className="repeating-entry-item">
          {children(value, (val) => handleChange(index, val), index)}
          {canRemove && index === values.length - 1 && (
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
