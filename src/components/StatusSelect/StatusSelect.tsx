import { STATUS, type Status } from "@convex/constants";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Selection } from "react-aria-components";
import { tv } from "tailwind-variants";
import {
  Badge,
  type BadgeProps,
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Tooltip,
  TooltipTrigger,
} from "../";

interface StatusBadgeProps extends Omit<BadgeProps, "children"> {
  status: Status;
  condensed?: boolean;
}

const badgeStyles = tv({
  base: "flex items-center transition-colors rounded-full",
  variants: {
    condensed: {
      true: "w-5 h-5 p-0",
      false: "pr-2",
    },
  },
});

export function StatusBadge({ status, condensed, ...props }: StatusBadgeProps) {
  if (status === undefined) return null;

  const { label, icon, variant } = STATUS[status];

  const InnerBadge = (
    <Badge
      icon={icon}
      variant={variant}
      {...props}
      className={badgeStyles({ condensed })}
    >
      {!condensed && label}
    </Badge>
  );

  if (!condensed) return InnerBadge;

  return (
    <TooltipTrigger>
      {InnerBadge}
      <Tooltip>{label}</Tooltip>
    </TooltipTrigger>
  );
}

interface StatusSelectProps {
  status: Status;
  isCore?: boolean;
  onChange: (status: Status) => void;
}

export function StatusSelect({ status, isCore, onChange }: StatusSelectProps) {
  const [selectedStatus, setSelectedStatus] = useState<Selection>(
    new Set([status]),
  );

  const handleSelectionChange = (status: Selection) => {
    onChange([...status][0] as Status);
    setSelectedStatus(status);
  };

  return (
    <MenuTrigger>
      <Button variant="ghost" className="px-2 gap-1">
        <StatusBadge status={status} size="lg" />
        <ChevronDown size={16} className="right-0" />
      </Button>
      <Menu
        placement="bottom end"
        selectionMode="single"
        selectedKeys={selectedStatus}
        disallowEmptySelection
        onSelectionChange={handleSelectionChange}
      >
        {Object.entries(STATUS).map(([status, details]) => {
          if (!isCore && details.isCoreOnly) return null;
          return (
            <MenuItem
              key={status}
              id={status}
              aria-label={details.label}
              className="h-9"
            >
              <StatusBadge status={status as Status} size="lg" />
            </MenuItem>
          );
        })}
      </Menu>
    </MenuTrigger>
  );
}
