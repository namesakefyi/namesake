import { composeTailwindRenderProps } from "@/components/utils";
import {
  ProgressBar as AriaProgressBar,
  type ProgressBarProps as AriaProgressBarProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { Label } from "../Field";

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
          <div className="flex items-baseline justify-between gap-2 -mt-0.5">
            <Label
              className={twMerge("text-gray-dim", labelHidden && "sr-only")}
            >
              {label}
            </Label>
            <span className="text-xs text-gray-dim tabular-nums">
              {valueText}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-4 dark:bg-graydark-4 outline outline-1 -outline-offset-1 outline-transparent relative overflow-hidden">
            <div
              className={`absolute top-0 h-full rounded-full bg-purple-9 dark:bg-purpledark-9 transition-all forced-colors:bg-[Highlight] ${isIndeterminate ? "left-full animate-in duration-10 [--tw-enter-translate-x:calc(-16rem-1%)] slide-out-to-right-full repeat-infinite ease-out" : "left-0"}`}
              style={{ width: `${isIndeterminate ? 40 : percentage}%` }}
            />
          </div>
        </>
      )}
    </AriaProgressBar>
  );
}
