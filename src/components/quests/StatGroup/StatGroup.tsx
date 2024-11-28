import {
  Button,
  DialogTrigger,
  Popover,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { CircleHelp } from "lucide-react";

export type StatGroupProps = {
  label: string;
  value: string;
  children?: React.ReactNode;
  popover?: {
    tooltip: string;
    content: React.ReactNode;
  };
};

export const StatGroup = ({
  label,
  value,
  children,
  popover,
}: StatGroupProps) => (
  <div className="flex flex-col flex-1 border border-gray-dim py-3 px-4 rounded-lg">
    <div className="text-gray-dim text-sm">{label}</div>
    <div className="text-xl flex gap-0.5 items-center">
      {value}
      {children}
      {popover && (
        <DialogTrigger>
          <TooltipTrigger>
            <Button variant="icon" size="small">
              <CircleHelp />
            </Button>
            <Tooltip>{popover.tooltip}</Tooltip>
          </TooltipTrigger>
          <Popover className="p-4">{popover.content}</Popover>
        </DialogTrigger>
      )}
    </div>
  </div>
);
