import { RiAddLine, RiSubtractLine } from "@remixicon/react";
import {
  NumberField as AriaNumberField,
  type NumberFieldProps as AriaNumberFieldProps,
  Group,
  Input,
  type ValidationResult,
} from "react-aria-components";
import { Button } from "../Button";
import { Text } from "../Content";
import { FieldError, Label } from "../Form";
import "./NumberField.css";

export interface NumberFieldProps extends AriaNumberFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function NumberField({
  label,
  description,
  errorMessage,
  ...props
}: NumberFieldProps) {
  return (
    <AriaNumberField {...props}>
      <Label>{label}</Label>
      <Group>
        <Button slot="decrement" icon={RiSubtractLine} aria-label="Decrement" />
        <Input />
        <Button slot="increment" icon={RiAddLine} aria-label="Increment" />
      </Group>
      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </AriaNumberField>
  );
}
