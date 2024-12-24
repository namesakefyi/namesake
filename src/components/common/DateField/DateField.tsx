import { composeTailwindRenderProps, focusRing } from "@/components/utils";
import {
  DateField as AriaDateField,
  type DateFieldProps as AriaDateFieldProps,
  DateInput as AriaDateInput,
  type DateInputProps as AriaDateInputProps,
  DateSegment,
  type DateValue,
  type ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { FieldDescription, FieldError, Label } from "../Field";
import { FieldGroup } from "../Field/Field";

export interface DateFieldProps<T extends DateValue>
  extends AriaDateFieldProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  size?: "medium" | "large";
}

export function DateField<T extends DateValue>({
  label,
  description,
  errorMessage,
  size = "medium",
  ...props
}: DateFieldProps<T>) {
  return (
    <AriaDateField
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-1",
      )}
    >
      {label && <Label size={size}>{label}</Label>}
      <FieldGroup size={size}>
        <DateInput size={size} />
      </FieldGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError>{errorMessage}</FieldError>
    </AriaDateField>
  );
}

const segmentStyles = tv({
  base: "inline p-0.5 type-literal:px-0 rounded outline outline-0 forced-color-adjust-none caret-transparent text-gray-normal forced-colors:text-[ButtonText]",
  variants: {
    isPlaceholder: {
      true: "text-gray-9 dark:text-graydark-9",
    },
    isDisabled: {
      true: "text-gray-2 dark:text-gray-6 forced-colors:text-[GrayText]",
    },
    isFocused: {
      true: "bg-purple-9 text-white dark:text-white forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]",
    },
  },
});

const dateFieldStyles = tv({
  extend: focusRing,
  base: "w-[12.5ch] tabular-nums group flex items-center overflow-hidden",
  variants: {
    size: {
      medium: "px-3 h-10",
      large: "px-3.5 h-12 text-lg",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

interface DateInputProps extends AriaDateInputProps {
  size?: "medium" | "large";
}

export function DateInput({
  size,
  ...props
}: Omit<DateInputProps, "children">) {
  return (
    <AriaDateInput
      className={(renderProps) =>
        dateFieldStyles({
          size,
          ...renderProps,
        })
      }
      {...props}
    >
      {(segment) => <DateSegment segment={segment} className={segmentStyles} />}
    </AriaDateInput>
  );
}
