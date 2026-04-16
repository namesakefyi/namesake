import {
  ToggleButtonGroup as RACToggleButtonGroup,
  type ToggleButtonGroupProps,
} from "react-aria-components";
import "./ToggleButtonGroup.css";
import clsx from "clsx";

export function ToggleButtonGroup({
  className,
  ...props
}: ToggleButtonGroupProps) {
  return (
    <RACToggleButtonGroup
      className={clsx("namesake-toggle-button-group", className)}
      {...props}
    />
  );
}
