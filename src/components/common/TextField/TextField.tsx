import { Eye, EyeOff } from "lucide-react";
import type { Ref } from "react";
import { useState } from "react";
import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import {
  Button,
  FieldDescription,
  FieldError,
  FieldGroup,
  type FieldSize,
  Input,
  Label,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { composeTailwindRenderProps } from "@/components/utils";

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string | React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  errorMessage?: string | ((validation: ValidationResult) => string);
  size?: FieldSize;
  placeholder?: string;
  ref?: Ref<HTMLInputElement>;
}

export function TextField({
  ref,
  label,
  description,
  prefix,
  suffix,
  errorMessage,
  type,
  size = "medium",
  placeholder,
  ...props
}: TextFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <AriaTextField
      {...props}
      ref={ref}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-1.5",
      )}
      type={type === "password" && isPasswordVisible ? "text" : type}
    >
      {({ isDisabled, isInvalid }) => (
        <>
          {label && <Label size={size}>{label}</Label>}
          <FieldGroup isDisabled={isDisabled} isInvalid={isInvalid} size={size}>
            {prefix}
            <Input
              className={twMerge(
                type === "password" && "font-mono",
                type === "tel" && "tabular-nums",
              )}
              size={size}
              placeholder={placeholder}
            />
            {suffix}
            {type === "password" && (
              <TooltipTrigger>
                <Button
                  variant="icon"
                  aria-label={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  size="small"
                  icon={isPasswordVisible ? Eye : EyeOff}
                  className="mr-1"
                />
                <Tooltip>
                  {isPasswordVisible ? "Hide password" : "Show password"}
                </Tooltip>
              </TooltipTrigger>
            )}
          </FieldGroup>
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError>{errorMessage}</FieldError>
        </>
      )}
    </AriaTextField>
  );
}
