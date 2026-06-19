import {
  SwitchButton,
  SwitchField,
  type SwitchFieldProps,
  type ValidationResult,
} from "react-aria-components";
import { Text } from "../Content";
import { FieldError } from "../Form";

import "./Switch.css";

export interface SwitchProps extends Omit<SwitchFieldProps, "children"> {
  children: React.ReactNode;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function Switch({
  children,
  description,
  errorMessage,
  ...props
}: SwitchProps) {
  return (
    <SwitchField {...props}>
      <SwitchButton>
        <div className="indicator" />
        {children}
      </SwitchButton>
      {description && <Text slot="description">{description}</Text>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </SwitchField>
  );
}
