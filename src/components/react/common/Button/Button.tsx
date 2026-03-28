import {
  composeRenderProps,
  Button as RACButton,
  type ButtonProps as RACButtonProps,
} from "react-aria-components";
import { ProgressCircle } from "../ProgressCircle";
import "./Button.css";
import type { RemixiconComponentType } from "@remixicon/react";
import clsx from "clsx";

export interface ButtonProps extends RACButtonProps {
  variant?: "primary" | "secondary";
  size?: "medium" | "large";
  icon?: RemixiconComponentType | null;
  endIcon?: RemixiconComponentType | null;
}

export function Button({
  variant = "secondary",
  size = "medium",
  icon: Icon,
  endIcon: EndIcon,
  className,
  ...props
}: ButtonProps) {
  const iconSize = size === "large" ? 28 : 24;

  return (
    <RACButton
      data-variant={variant}
      data-size={size}
      {...props}
      className={clsx("react-aria-Button", className)}
    >
      {composeRenderProps(props.children, (children, { isPending }) => (
        <>
          {!isPending && Icon && (
            <Icon className="react-aria-Button-start-icon" size={iconSize} />
          )}
          {isPending && (
            <ProgressCircle
              aria-label="Saving..."
              size={size === "large" ? 24 : 20}
              isIndeterminate
            />
          )}
          {children}
          {EndIcon && (
            <EndIcon className="react-aria-Button-end-icon" size={iconSize} />
          )}
        </>
      ))}
    </RACButton>
  );
}
