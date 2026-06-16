import {
  Button,
  type ButtonProps,
  type FieldErrorProps,
  type FormProps,
  type LabelProps,
  FieldError as RACFieldError,
  Form as RACForm,
  Label as RACLabel,
} from "react-aria-components";
import "./Form.css";
import clsx from "clsx";
import type { Ref } from "react";

export function Form({
  ref,
  className,
  ...props
}: FormProps & { ref?: Ref<HTMLFormElement> }) {
  return (
    <RACForm
      className={clsx("namesake-form", className)}
      ref={ref}
      {...props}
    />
  );
}

export function Label({ className, ...props }: LabelProps) {
  return <RACLabel className={clsx("namesake-label", className)} {...props} />;
}

export function FieldError({ className, ...props }: FieldErrorProps) {
  return (
    <RACFieldError
      className={clsx("namesake-field-error", className)}
      {...props}
    />
  );
}

export function FieldButton({ className, ...props }: ButtonProps) {
  return (
    <Button className={clsx("namesake-field-button", className)} {...props} />
  );
}
