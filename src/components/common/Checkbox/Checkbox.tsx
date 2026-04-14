import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as AriaCheckboxProps,
  type ValidationResult,
} from "react-aria-components";
import { FieldError } from "../Form";

import "./Checkbox.css";
import clsx from "clsx";
import { smartquotes } from "../../../utils/smartquotes";

export interface CheckboxProps extends AriaCheckboxProps {
  label?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function Checkbox({
  children,
  label,
  className,
  errorMessage,
  ...props
}: CheckboxProps) {
  return (
    <AriaCheckbox className={clsx("namesake-checkbox", className)} {...props}>
      {({ isIndeterminate }) => (
        <>
          <div className="checkbox">
            <svg viewBox="0 0 18 18" aria-hidden="true">
              {isIndeterminate ? (
                <rect x={1} y={7.5} width={15} height={2} />
              ) : (
                <polyline points="1 9 7 14 15 4" />
              )}
            </svg>
          </div>
          {label && smartquotes(label)}
          {children}
          {errorMessage && <FieldError>{errorMessage}</FieldError>}
        </>
      )}
    </AriaCheckbox>
  );
}
