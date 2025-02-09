import { Label } from "@/components/common";
import { composeTailwindRenderProps } from "@/components/utils";
import {
  Meter as AriaMeter,
  type MeterProps as AriaMeterProps,
} from "react-aria-components";
import { RandomReveal } from "react-random-reveal";

export interface MeterProps extends AriaMeterProps {
  value: number;
}

type StrengthConfig = {
  label: string;
  color: {
    text: string;
    bg: string;
  };
};

export const strengthConfig: Record<number, StrengthConfig> = {
  0: {
    label: "Weak!",
    color: {
      text: "text-red-9 dark:text-reddark-9",
      bg: "bg-transparent",
    },
  },
  1: {
    label: "Weak",
    color: {
      text: "text-orange-9 dark:text-orangedark-9",
      bg: "bg-orange-9 dark:bg-orangedark-9",
    },
  },
  2: {
    label: "Okay",
    color: {
      text: "text-gray-normal dark:text-amberdark-9",
      bg: "bg-amber-9 dark:bg-amberdark-9",
    },
  },
  3: {
    label: "Good",
    color: {
      text: "text-grass-9 dark:text-grassdark-9",
      bg: "bg-grass-9 dark:bg-grassdark-9",
    },
  },
  4: {
    label: "Great",
    color: {
      text: "text-green-10 dark:text-greendark-10",
      bg: "bg-green-9 dark:bg-greendark-9",
    },
  },
};

const StrengthLabel = ({ value }: { value: number }) => (
  <span
    className={`text-sm uppercase font-medium font-mono tracking-wider transition-colors duration-500 ${strengthConfig[value].color.text}`}
    aria-label={strengthConfig[value].label}
  >
    <RandomReveal
      characters={strengthConfig[value].label}
      isPlaying={true}
      duration={0.5}
      revealEasing="linear"
      revealDuration={0.2}
      key={value}
    />
  </span>
);

export function PasswordStrength({ value, ...props }: MeterProps) {
  if (value < 0 || value > 4) {
    throw new Error("Value must be between 0 and 4");
  }

  return (
    <AriaMeter
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-1",
      )}
      value={value}
      minValue={0}
      maxValue={4}
    >
      {({ percentage }) => (
        <>
          <div className="w-full min-w-64 h-1 rounded-full bg-gray-4 dark:bg-graydark-4 outline outline-1 -outline-offset-1 outline-transparent relative overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full w-full rounded-full ${strengthConfig[value].color.bg} transition-all duration-300 forced-colors:bg-[Highlight]`}
              style={{ translate: `-${100 - percentage}%` }}
              data-testid="meter-fill"
            />
          </div>
          <div className="flex justify-between gap-2">
            <Label className="text-gray-dim font-mono">Password Strength</Label>
            <StrengthLabel value={value} />
          </div>
        </>
      )}
    </AriaMeter>
  );
}
