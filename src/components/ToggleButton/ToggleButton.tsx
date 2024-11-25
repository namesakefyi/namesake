import {
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { buttonStyles } from "../Button";
import { focusRing } from "../utils";

const styles = tv({
  extend: focusRing,
  base: "h-10 px-3.5 [&:has(svg:only-child)]:px-2 text-sm text-center transition rounded-lg border border-black/10 dark:border-white/10 forced-colors:border-[ButtonBorder] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] dark:shadow-none forced-color-adjust-none",
  variants: {
    isSelected: {
      false: buttonStyles.variants.variant.secondary,
      true: "bg-gray-12 dark:bg-graydark-12 text-gray-1 dark:text-gray-12 shadow-sm",
    },
    isDisabled: buttonStyles.variants.isDisabled,
  },
});

export function ToggleButton(props: ToggleButtonProps) {
  return (
    <AriaToggleButton
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        styles({ ...renderProps, className }),
      )}
    />
  );
}
