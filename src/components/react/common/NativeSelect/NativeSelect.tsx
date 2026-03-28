import clsx from "clsx";
import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type SelectHTMLAttributes,
  useId,
} from "react";
import "../Button/Button.css";
import "../Select/Select.css";
import { Label } from "../Form";

export type NativeOptionProps = ComponentPropsWithoutRef<"option">;

export const NativeOption = forwardRef<HTMLOptionElement, NativeOptionProps>(
  function NativeOption(props, ref) {
    return <option ref={ref} {...props} />;
  },
);

export interface NativeSelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Rendered above the select as `<label htmlFor>`. */
  label?: string;
}

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelect({ label, className, id, children, ...props }, ref) {
    const genId = useId();
    const selectId = id ?? genId;

    return (
      <div className={clsx("react-aria-Select", className)}>
        {label ? <Label htmlFor={selectId}>{label}</Label> : null}
        <select
          ref={ref}
          className={clsx("react-aria-Button", "react-aria-NativeSelect")}
          id={selectId}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  },
);
