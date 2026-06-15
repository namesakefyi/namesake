import {
  CheckboxButton,
  CheckboxField,
  type CheckboxFieldProps,
  Text,
  type ValidationResult,
} from "react-aria-components";
import { FieldError } from "../Form";

import "./Checkbox.css";
import clsx from "clsx";
import { smartquotes } from "#utils/smartquotes";

export interface CheckboxProps extends CheckboxFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function Checkbox({
  children,
  label,
  description,
  className,
  errorMessage,
  ...props
}: CheckboxProps) {
  return (
    <CheckboxField
      className={clsx("namesake-checkbox-field", className)}
      {...props}
    >
      <CheckboxButton className="namesake-checkbox">
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
          </>
        )}
      </CheckboxButton>
      {description && <Text slot="description">{description}</Text>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </CheckboxField>
  );
}
