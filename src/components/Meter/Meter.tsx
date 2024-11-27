import { AlertTriangle } from "lucide-react";
import {
  Meter as AriaMeter,
  type MeterProps as AriaMeterProps,
} from "react-aria-components";
import { Label } from "../Field";
import { composeTailwindRenderProps } from "../utils";

export interface MeterProps extends AriaMeterProps {
  label?: string;
}

export function Meter({ label, ...props }: MeterProps) {
  return (
    <AriaMeter
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-1",
      )}
    >
      {({ percentage, valueText }) => (
        <>
          <div className="flex justify-between gap-2">
            <Label className="text-gray-normal">{label}</Label>
            <span
              className={`text-sm ${percentage >= 80 ? "text-red-dim" : "text-gray-dim"}`}
            >
              {percentage >= 80 && (
                <AlertTriangle
                  aria-label="Alert"
                  className="inline-block w-4 h-4 align-text-bottom"
                />
              )}
              {valueText}
            </span>
          </div>
          <div className="w-64 h-2 rounded-full bg-gray-4 dark:bg-graydark-4 outline outline-1 -outline-offset-1 outline-transparent relative">
            <div
              className={`absolute top-0 left-0 h-full rounded-full ${getColor(percentage)} forced-colors:bg-[Highlight]`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </>
      )}
    </AriaMeter>
  );
}

function getColor(percentage: number) {
  if (percentage < 70) {
    return "bg-green-9 dark:bg-greendark-9";
  }

  if (percentage < 80) {
    return "bg-orange-9 dark:bg-orangedark-9";
  }

  return "bg-red-9 dark:bg-reddark-9";
}
