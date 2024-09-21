import {
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { focusRing } from "../utils";

interface LinkProps extends AriaLinkProps {
  variant?: "primary" | "secondary";
}

const styles = tv({
  extend: focusRing,
  base: "underline disabled:no-underline disabled:cursor-default forced-colors:disabled:text-[GrayText] transition rounded",
  variants: {
    variant: {
      primary: "text-blue-9 dark:text-bluedark-9",
      secondary: "text-gray-dim hover:text-gray-normal",
    },
  },
  defaultVariants: {
    variant: "secondary",
  },
});

export function Link(props: LinkProps) {
  return (
    <AriaLink
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        styles({ ...renderProps, className, variant: props.variant }),
      )}
    />
  );
}
