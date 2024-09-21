import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react";
import {
  NumberField as AriaNumberField,
  type NumberFieldProps as AriaNumberFieldProps,
  Button,
  type ButtonProps,
  type ValidationResult,
} from "react-aria-components";
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  Input,
  Label,
  fieldBorderStyles,
} from "../Field";
import { composeTailwindRenderProps } from "../utils";

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
    <AriaNumberField
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-1",
      )}
    >
      <Label>{label}</Label>
      <FieldGroup>
        {(renderProps) => (
          <>
            <Input />
            <div
              className={fieldBorderStyles({
                ...renderProps,
                class: "flex flex-col border-s h-10",
              })}
            >
              <StepperButton slot="increment">
                <RiArrowUpSLine aria-hidden className="w-4 h-4" />
              </StepperButton>
              <div
                className={fieldBorderStyles({
                  ...renderProps,
                  class: "border-b",
                })}
              />
              <StepperButton slot="decrement">
                <RiArrowDownSLine aria-hidden className="w-4 h-4" />
              </StepperButton>
            </div>
          </>
        )}
      </FieldGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
    </AriaNumberField>
  );
}

function StepperButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      className="p-0.5 cursor-pointer text-gray-dim group-disabled:text-gray-2 dark:text-gray-4 dark:pressed:bg-gray-11 dark:group-disabled:text-gray-6 forced-colors:group-disabled:text-[GrayText]"
    />
  );
}
