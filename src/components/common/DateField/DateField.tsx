import {
  FieldDescription,
  FieldError,
  FieldGroup,
  Label,
} from "@/components/common";
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
      {({ isDisabled, isInvalid }) => (
        <>
          {label && <Label size={size}>{label}</Label>}
          <FieldGroup isDisabled={isDisabled} isInvalid={isInvalid} size={size}>
            <DateInput size={size} />
          </FieldGroup>
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldError>{errorMessage}</FieldError>
        </>
      )}
    </AriaDateField>
  );
}

const segmentStyles = tv({
  base: "inline px-0.5 type-literal:px-1 rounded-sm outline-none forced-color-adjust-none caret-transparent text-normal forced-colors:text-[ButtonText]",
  variants: {
    isPlaceholder: {
      true: "text-placeholder",
    },
    isDisabled: {
      true: "text-gray-2 forced-colors:text-[GrayText]",
    },
    isFocused: {
      true: "bg-theme-9 text-white forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]",
    },
  },
});

const dateFieldStyles = tv({
  extend: focusRing,
  base: "w-[15ch] tabular-nums group flex items-center overflow-hidden",
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
