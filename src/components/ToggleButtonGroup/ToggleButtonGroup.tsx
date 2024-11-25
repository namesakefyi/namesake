import {
  ToggleButtonGroup as AriaToggleButtonGroup,
  type ToggleButtonGroupProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const styles = tv({
  base: "border rounded-lg grid grid-flow-col auto-cols-fr border-black/10 dark:border-white/10 *:border-0",
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
