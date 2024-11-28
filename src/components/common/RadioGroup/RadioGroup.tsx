import { composeTailwindRenderProps, focusRing } from "@/components/utils";
import type { ReactNode } from "react";
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps,
  type ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { FieldDescription, FieldError, Label } from "../Field";

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, "children"> {
  label?: string;
  children?: ReactNode;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function RadioGroup(props: RadioGroupProps) {
  return (
    <AriaRadioGroup
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-2",
      )}
    >
      <Label>{props.label}</Label>
      <div className="flex group-orientation-vertical:flex-col gap-2 group-orientation-horizontal:gap-4">
        {props.children}
      </div>
      {props.description && (
        <FieldDescription>{props.description}</FieldDescription>
      )}
      <FieldError>{props.errorMessage}</FieldError>
    </AriaRadioGroup>
  );
}

const styles = tv({
  extend: focusRing,
  base: "w-5 h-5 rounded-full border bg-white dark:bg-gray-12 transition-all cursor-pointer",
  variants: {
    isSelected: {
      false: "border-gray-normal",
      true: "border-[7px] dark:bg-white border-purple-9 dark:border-purpledark-9 forced-colors:!border-[Highlight] group-pressed:border-purple-10 dark:group-pressed:border-purpledark-10",
    },
    isInvalid: {
      true: "border-red-9 dark:border-reddark-9 group-pressed:border-red-11 dark:group-pressed:border-reddark-11 forced-colors:!border-[Mark]",
    },
    isDisabled: {
      true: "border-gray-2 dark:border-gray-8 cursor-default forced-colors:!border-[GrayText]",
    },
  },
});

export function Radio(props: RadioProps) {
  return (
    <AriaRadio
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex gap-2 items-center group text-gray-normal disabled:opacity-50 forced-colors:disabled:text-[GrayText] transition",
      )}
    >
      {(renderProps) => (
        <>
          <div className={styles(renderProps)} />
          {renderProps.defaultChildren}
        </>
      )}
    </AriaRadio>
  );
}
