import { STATUS, type Status } from "@convex/constants";
import { RiArrowDropDownFill } from "@remixicon/react";
import { useState } from "react";
import type { Selection } from "react-aria-components";
import {
  Badge,
  type BadgeProps,
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
} from "../";

interface StatusBadgeProps extends Omit<BadgeProps, "children"> {
  status: Status;
}

export function StatusBadge({ status, ...props }: StatusBadgeProps) {
  if (status === undefined) return null;

  const { label, icon, variant } = STATUS[status];

  return (
    <Badge icon={icon} variant={variant} {...props}>
      {label}
    </Badge>
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
      <Button size="small" variant="ghost" className="px-1 gap-0.5">
        <StatusBadge status={status} size="lg" />
        <RiArrowDropDownFill size={16} className="right-0" />
      </Button>
      <Menu
        placement="bottom start"
        selectionMode="single"
        selectedKeys={selectedStatus}
        disallowEmptySelection
        onSelectionChange={handleSelectionChange}
      >
        {Object.entries(STATUS).map(([status, details]) => {
          if (!isCore && details.isCoreOnly) return null;
          return (
            <MenuItem key={status} id={status} aria-label={details.label}>
              <StatusBadge status={status as Status} />
            </MenuItem>
          );
        })}
      </Menu>
    </MenuTrigger>
  );
}
