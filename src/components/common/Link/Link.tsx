import { type ButtonProps, buttonStyles } from "@/components/common";
import { focusRing } from "@/components/utils";
import type { Ref } from "react";
import {
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

export interface LinkProps extends AriaLinkProps {
  variant?: "primary" | "secondary";
  button?: Omit<ButtonProps, "children" | "icon">;
  ref?: Ref<HTMLAnchorElement>;
}

const linkStyles = tv({
  extend: focusRing,
  base: "underline disabled:no-underline disabled:cursor-default forced-colors:disabled:text-[GrayText] transition rounded-sm",
  variants: {
    variant: {
      primary: "text-blue-9",
      secondary: "text-gray-dim hover:text-gray-normal",
    },
  },
  defaultVariants: {
    variant: "secondary",
  },
});

export function Link({ button, ref, ...props }: LinkProps) {
  return (
    <AriaLink
      ref={ref}
      {...props}
      className={composeRenderProps(
        props.className,
        (className, renderProps) =>
          button
            ? buttonStyles({
                ...renderProps,
                ...button,
                className,
              })
            : linkStyles({ ...renderProps, variant: props.variant, className }),
      )}
    />
  );
}
