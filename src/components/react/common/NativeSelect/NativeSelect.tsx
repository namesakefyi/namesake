import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef, useId } from "react";
import "../Button/Button.css";
import "../Select/Select.css";
import { Label } from "../Form";

export type NativeSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type NativeSelectProps = Omit<
  ComponentPropsWithoutRef<"select">,
  "children"
> & {
  label?: string;
  options: readonly NativeSelectOption[];
};

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelect({ label, options, className, ...props }, ref) {
    const id = useId();

    return (
      <div className={clsx("react-aria-Select", className)}>
        {label ? <Label htmlFor={id}>{label}</Label> : null}
        <select
          ref={ref}
          id={id}
          className={clsx("react-aria-Button", "react-aria-NativeSelect")}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  },
);
