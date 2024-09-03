import {
  Separator as AriaSeparator,
  type SeparatorProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const styles = tv({
  base: "bg-gray-3 dark:bg-gray-6 forced-colors:bg-[ButtonBorder]",
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "w-px",
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
