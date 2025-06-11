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
      {({ isDisabled, isInvalid }) => (
        <>
          {label && <Label>{label}</Label>}
          <FieldGroup isDisabled={isDisabled} isInvalid={isInvalid}>
            {({ isDisabled, isInvalid }) => (
              <>
                {prefix && (
                  <span className="text-gray-9 ml-2 -mr-2">{prefix}</span>
                )}
                <Input />
                <div
                  className={innerBorderStyles({
                    isDisabled,
                    isInvalid,
                    class: "flex flex-col border-s h-10",
                  })}
                >
                  <StepperButton slot="increment">
                    <ChevronUp aria-hidden className="w-4 h-4" />
                  </StepperButton>
                  <div
                    className={innerBorderStyles({
                      isDisabled,
                      isInvalid,
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
      className="p-0.5 cursor-pointer text-dim group-disabled:text-gray-2 forced-colors:group-disabled:text-[GrayText]"
    />
  );
}
