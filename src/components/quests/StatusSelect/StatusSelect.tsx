import {
  Badge,
  type BadgeProps,
  Button,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
} from "@/components/common";
import { STATUS, type Status } from "@convex/constants";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import type { Selection } from "react-aria-components";
import { tv } from "tailwind-variants";

interface StatusBadgeProps extends Omit<BadgeProps, "children"> {
  status: Status;
  condensed?: boolean;
  className?: string;
}

const badgeStyles = tv({
  base: "flex items-center transition-colors rounded-full select-none",
  variants: {
    condensed: {
      true: "size-5 p-0 lg:size-6",
      false: "pr-2",
    },
  },
});

export function StatusBadge({
  status,
  condensed,
  className,
  ...props
}: StatusBadgeProps) {
  if (status === undefined) return null;

  const { label, icon, variant } = STATUS[status];

  return (
    <Badge
      icon={icon}
      variant={variant}
      {...props}
      aria-label={condensed ? label : undefined}
      className={badgeStyles({ condensed, className })}
    >
      {!condensed && label}
    </Badge>
  );
}

interface StatusSelectProps {
  status: Status;
  onChange: (status: Status) => void;
  onRemove: () => void;
}

export function StatusSelect({
  status,
  onChange,
  onRemove,
}: StatusSelectProps) {
  const [selectedStatus, setSelectedStatus] = useState<Selection>(
    new Set([status]),
  );

  useEffect(() => {
    setSelectedStatus(new Set([status]));
  }, [status]);

  const handleSelectionChange = (status: Selection) => {
    onChange([...status][0] as Status);
    setSelectedStatus(status);
  };

  const handleRemove = () => {
    onRemove();
  };

  return (
    <MenuTrigger>
      <Button
        variant="ghost"
        size="small"
        className="gap-1 pl-1 rounded-full"
        endIcon={ChevronDown}
      >
        <StatusBadge status={status} size="lg" />
      </Button>
      <Menu placement="bottom end">
        <MenuSection
          title="Status"
          selectionMode="single"
          selectedKeys={selectedStatus}
          disallowEmptySelection
          onSelectionChange={handleSelectionChange}
        >
          {Object.entries(STATUS).map(([status, details]) => (
            <MenuItem
              key={status}
              id={status}
              aria-label={details.label}
              className="h-9"
            >
              <StatusBadge status={status as Status} size="lg" />
            </MenuItem>
          ))}
        </MenuSection>
        <MenuSection>
          <MenuItem onAction={handleRemove}>Remove from my list</MenuItem>
        </MenuSection>
      </Menu>
    </MenuTrigger>
  );
}
