import {
  Button,
  DialogTrigger,
  Popover,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { CircleHelp } from "lucide-react";

export type StatPopoverProps = {
  tooltip: string;
  children: React.ReactNode;
};

export const StatPopover = ({ tooltip, children }: StatPopoverProps) => (
  <DialogTrigger>
    <TooltipTrigger>
      <Button
        variant="icon"
        size="small"
        aria-label={tooltip}
        icon={CircleHelp}
      />
      <Tooltip>{tooltip}</Tooltip>
    </TooltipTrigger>
    <Popover className="p-4">{children}</Popover>
  </DialogTrigger>
);

export type StatGroupProps = {
  label: string;
  value: string;
  children?: React.ReactNode;
};

export const StatGroup = ({ label, value, children }: StatGroupProps) => (
  <div className="flex flex-col flex-1 py-3 px-4">
    <div className="text-gray-dim text-sm">{label}</div>
    <div className="text-xl flex gap-1 items-center h-8">
      {value}
      {children}
    </div>
  </div>
);
