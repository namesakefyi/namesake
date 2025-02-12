import {
  FieldDescription,
  FieldError,
  FieldGroup,
  Input,
  Label,
  innerBorderStyles,
} from "@/components/common";
import { composeTailwindRenderProps } from "@/components/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  NumberField as AriaNumberField,
  type NumberFieldProps as AriaNumberFieldProps,
  Button,
  type ButtonProps,
  type ValidationResult,
} from "react-aria-components";

export interface NumberFieldProps extends AriaNumberFieldProps {
  label?: string;
  prefix?: React.ReactNode;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function NumberField({
  label,
  description,
  prefix,
  errorMessage,
  ...props
}: NumberFieldProps) {
  return (
    <AriaNumberField
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-1.5",
      )}
    >
      {(renderProps) => (
        <>
          {label && <Label>{label}</Label>}
          <FieldGroup {...renderProps}>
            {(renderProps) => (
              <>
                {prefix && (
                  <span className="text-gray-9 dark:text-graydark-9 ml-2 -mr-2">
                    {prefix}
                  </span>
                )}
                <Input />
                <div
                  className={innerBorderStyles({
                    ...renderProps,
                    class: "flex flex-col border-s h-10",
                  })}
                >
                  <StepperButton slot="increment">
                    <ChevronUp aria-hidden className="w-4 h-4" />
                  </StepperButton>
                  <div
                    className={innerBorderStyles({
                      ...renderProps,
                      class: "border-b",
                    })}
                  />
                  <StepperButton slot="decrement">
                    <ChevronDown aria-hidden className="w-4 h-4" />
                  </StepperButton>
                </div>
              </>
            )}
          </FieldGroup>
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError>{errorMessage}</FieldError>
        </>
      )}
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
