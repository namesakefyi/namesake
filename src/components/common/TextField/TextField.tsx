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
import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";
import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string | React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  errorMessage?: string | ((validation: ValidationResult) => string);
  size?: FieldSize;
  placeholder?: string;
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
      placeholder,
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
        {(renderProps) => (
          <>
            {label && <Label size={size}>{label}</Label>}
            <FieldGroup {...renderProps} size={size}>
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
  },
);
