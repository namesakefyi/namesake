import { Button, Tooltip, TooltipTrigger } from "@/components/common";
import { CircleHelp } from "lucide-react";

export type StatTooltipProps = {
  children: React.ReactNode;
};

export const StatTooltip = ({ children }: StatTooltipProps) => (
  <TooltipTrigger>
    <Button
      variant="icon"
      size="small"
      className="size-4"
      aria-label="See details"
      icon={CircleHelp}
      iconProps={{ size: 12 }}
    />
    <Tooltip>{children}</Tooltip>
  </TooltipTrigger>
);
