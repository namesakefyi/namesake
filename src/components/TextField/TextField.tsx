import { RiEyeCloseLine, RiEyeLine } from "@remixicon/react";
import { useState } from "react";
import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Button } from "../Button";
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  Input,
  Label,
  fieldBorderStyles,
} from "../Field";
import { Tooltip, TooltipTrigger } from "../Tooltip";
import { composeTailwindRenderProps, focusRing } from "../utils";

const inputStyles = tv({
  extend: focusRing,
  base: "border rounded-lg flex",
  variants: {
    isFocused: fieldBorderStyles.variants.isFocusWithin,
    ...fieldBorderStyles.variants,
  },
});

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string | React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function TextField({
  label,
  description,
  prefix,
  suffix,
  errorMessage,
  ...props
}: TextFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <AriaTextField
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-2",
      )}
      type={
        props.type === "password" && isPasswordVisible ? "text" : props.type
      }
    >
      {label && <Label>{label}</Label>}
      <FieldGroup className={inputStyles}>
        {prefix}
        <Input />
        {suffix}
        {props.type === "password" && (
          <TooltipTrigger>
            <Button
              variant="icon"
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              size="small"
              icon={isPasswordVisible ? RiEyeLine : RiEyeCloseLine}
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
}
