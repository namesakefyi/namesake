import {
  ToggleButton as RACToggleButton,
  type ToggleButtonProps,
} from "react-aria-components";
import "./ToggleButton.css";
import clsx from "clsx";

export function ToggleButton({ className, ...props }: ToggleButtonProps) {
  return (
    <RACToggleButton
      className={clsx("namesake-toggle-button", className)}
      {...props}
    />
  );
}
