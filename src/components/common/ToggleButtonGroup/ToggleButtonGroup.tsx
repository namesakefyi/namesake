import {
  ToggleButtonGroup as AriaToggleButtonGroup,
  composeRenderProps,
  type ToggleButtonGroupProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const styles = tv({
  base: "rounded-full bg-theme-a3 dark:bg-theme-a2 grid grid-flow-col auto-cols-fr",
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
});

export function ToggleButtonGroup(props: ToggleButtonGroupProps) {
  return (
    <AriaToggleButtonGroup
      {...props}
      className={composeRenderProps(props.className, (className) =>
        styles({ orientation: props.orientation || "horizontal", className }),
      )}
    />
  );
}
