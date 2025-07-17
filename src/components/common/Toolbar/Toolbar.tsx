import {
  Toolbar as AriaToolbar,
  composeRenderProps,
  type ToolbarProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const styles = tv({
  base: "flex gap-0.5",
  variants: {
    orientation: {
      horizontal: "w-full flex-row items-center justify-start overflow-x-auto",
      vertical: "flex-col items-start overflow-y-auto",
    },
  },
});

export function Toolbar(props: ToolbarProps) {
  return (
    <AriaToolbar
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        styles({ ...renderProps, className }),
      )}
    />
  );
}
