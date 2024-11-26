import {
  ToggleButtonGroup as AriaToggleButtonGroup,
  type ToggleButtonGroupProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const styles = tv({
  base: "rounded-lg grid grid-flow-col auto-cols-fr shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] *:border-0",
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
