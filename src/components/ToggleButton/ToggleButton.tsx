import {
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { focusRing } from "../utils";

const styles = tv({
  extend: focusRing,
  base: "px-5 py-2 text-sm text-center transition rounded-lg border border-black/10 dark:border-white/10 forced-colors:border-[ButtonBorder] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] dark:shadow-none cursor-default forced-color-adjust-none",
  variants: {
    isSelected: {
      false:
        "bg-gray-1 hover:bg-gray-2 pressed:bg-gray-3 text-gray-10 dark:bg-gray-6 dark:hover:bg-gray-5 dark:pressed:bg-gray-4 dark:text-gray-1 forced-colors:!bg-[ButtonFace] forced-colors:!text-[ButtonText]",
      true: "bg-gray-9 hover:bg-gray-10 pressed:bg-gray-11 text-white dark:bg-gray-3 dark:hover:bg-gray-2 dark:pressed:bg-gray-1 dark:text-black forced-colors:!bg-[Highlight] forced-colors:!text-[HighlightText]",
    },
    isDisabled: {
      true: "bg-gray-1 dark:bg-gray-11 forced-colors:!bg-[ButtonFace] text-gray-3 dark:text-gray-6 forced-colors:!text-[GrayText] border-black/5 dark:border-white/5 forced-colors:border-[GrayText]",
    },
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