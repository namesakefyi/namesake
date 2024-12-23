import { composeTailwindRenderProps } from "@/components/utils";
import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";
import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { Button } from "../Button";
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  Input,
  Label,
} from "../Field";
import { Tooltip, TooltipTrigger } from "../Tooltip";

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string | React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  errorMessage?: string | ((validation: ValidationResult) => string);
  size?: "medium" | "large";
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      label,
      description,
      prefix,
      suffix,
      errorMessage,
      type,
      size = "medium",
      ...props
    },
    ref,
  ) {
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
        {label && <Label size={size}>{label}</Label>}
        <FieldGroup size={size}>
          {prefix}
          <Input
            className={twMerge(
              type === "password" && "font-mono",
              type === "tel" && "tabular-nums",
            )}
            size={size}
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
      </AriaTextField>
    );
  },
);
