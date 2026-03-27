import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef, useId } from "react";
import { Text } from "../Content";
import "../Button/Button.css";
import "../Select/Select.css";
import { FieldError, Label } from "../Form";

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
  description?: string;
  errorMessage?: string;
  options: readonly NativeSelectOption[];
};

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelect(
    {
      label,
      description,
      errorMessage,
      options,
      className,
      id,
      "aria-describedby": ariaDescribedByProp,
      "aria-invalid": ariaInvalidProp,
      style: selectStyle,
      ...selectProps
    },
    ref,
  ) {
    const reactId = useId();
    const selectId = id ?? reactId;
    const descriptionId = `${selectId}-description`;
    const errorId = `${selectId}-error`;

    const describedBy = [
      ariaDescribedByProp,
      description ? descriptionId : null,
      errorMessage ? errorId : null,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={clsx("react-aria-Select", className)}>
        {label ? <Label htmlFor={selectId}>{label}</Label> : null}
        <select
          ref={ref}
          id={selectId}
          className={clsx("namesake-button", "namesake-native-select-trigger")}
          aria-describedby={describedBy || undefined}
          aria-invalid={ariaInvalidProp ?? Boolean(errorMessage)}
          style={selectStyle}
          {...selectProps}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        {description ? (
          <Text id={descriptionId} slot="description">
            {description}
          </Text>
        ) : null}
        {errorMessage ? (
          <FieldError id={errorId}>{errorMessage}</FieldError>
        ) : null}
      </div>
    );
  },
);
