import {
  composeRenderProps,
  Button as RACButton,
  type ButtonProps as RACButtonProps,
} from "react-aria-components";
import { ProgressCircle } from "../ProgressCircle";
import "./Button.css";
import type { RemixiconComponentType } from "@remixicon/react";
import clsx from "clsx";

type ButtonSize = "medium" | "large";

const ICON_SIZE: Record<ButtonSize, number> = {
  medium: 24,
  large: 28,
};

const PROGRESS_CIRCLE_SIZE: Record<ButtonSize, number> = {
  medium: 20,
  large: 24,
};

export interface ButtonProps extends RACButtonProps {
  variant?: "primary" | "secondary";
  size?: ButtonSize;
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
  const iconSize = ICON_SIZE[size];

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
            <Icon className="react-aria-Button-icon" size={iconSize} />
          )}
          {isPending && (
            <ProgressCircle
              aria-label="Saving..."
              size={PROGRESS_CIRCLE_SIZE[size]}
              isIndeterminate
            />
          )}
          {children && <span>{children}</span>}
          {EndIcon && (
            <EndIcon className="react-aria-Button-icon" size={iconSize} />
          )}
        </>
      ))}
    </RACButton>
  );
}
