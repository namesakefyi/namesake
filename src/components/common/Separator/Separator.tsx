import {
  Separator as AriaSeparator,
  type SeparatorProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const styles = tv({
  base: "border-gray-dim forced-colors:bg-[ButtonBorder]",
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "w-px h-6 mx-1.5 bg-gray-4 dark:bg-graydark-4 shrink-0",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export function Separator(props: SeparatorProps) {
  return (
    <AriaSeparator
      {...props}
      className={styles({
        orientation: props.orientation,
        className: props.className,
      })}
    />
  );
}
