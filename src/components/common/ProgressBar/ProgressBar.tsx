import { Label } from "@/components/common";
import { composeTailwindRenderProps } from "@/components/utils";
import {
  ProgressBar as AriaProgressBar,
  type ProgressBarProps as AriaProgressBarProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

export interface ProgressBarProps extends AriaProgressBarProps {
  label: string;
  labelHidden?: boolean;
}

export function ProgressBar({
  label,
  labelHidden = false,
  ...props
}: ProgressBarProps) {
  return (
    <AriaProgressBar
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col flex-1 gap-1.5",
      )}
    >
      {({ percentage, valueText, isIndeterminate }) => (
        <>
          <div
            className={twMerge(
              "flex items-baseline justify-between gap-2 -mt-0.5",
              labelHidden && "sr-only",
            )}
          >
            <Label className="text-dim">{label}</Label>
            <span className="text-xs text-dim tabular-nums">{valueText}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-theme-a4 outline-1 -outline-offset-1 outline-transparent relative overflow-hidden">
            <div
              className={`absolute top-0 h-full rounded-full bg-theme-9 transition-all forced-colors:bg-[Highlight] ${isIndeterminate ? "left-full animate-in duration-10 [--tw-enter-translate-x:calc(-16rem-1%)] slide-out-to-right-full repeat-infinite ease-out" : "left-0"}`}
              style={{ width: `${isIndeterminate ? 40 : percentage}%` }}
            />
          </div>
        </>
      )}
    </AriaProgressBar>
  );
}
