import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import type { Selection } from "react-aria-components";
import { tv } from "tailwind-variants";
import {
  Badge,
  type BadgeProps,
  Button,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
} from "@/components/common";
import { STATUS, type Status } from "@/constants";

interface StatusBadgeProps extends Omit<BadgeProps, "children"> {
  status: Status;
  condensed?: boolean;
  className?: string;
}

const badgeStyles = tv({
  base: "flex items-center transition-colors rounded-full select-none",
  variants: {
    condensed: {
      true: "p-0 size-6",
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
  onRemove?: () => void;
  condensed?: boolean;
  className?: string;
}

export function StatusSelect({
  status,
  condensed,
  className,
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
    onRemove?.();
  };

  const buttonStyles = tv({
    base: "gap-1 rounded-full",
    variants: {
      condensed: {
        true: "p-1",
        false: "pl-1",
      },
    },
  });

  return (
    <MenuTrigger>
      <Button
        variant="ghost"
        size="small"
        className={buttonStyles({ condensed, className })}
        endIcon={!condensed ? ChevronDown : undefined}
      >
        <StatusBadge status={status} size="lg" condensed={condensed} />
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
        {onRemove && (
          <MenuSection>
            <MenuItem onAction={handleRemove}>Remove from my quests</MenuItem>
          </MenuSection>
        )}
      </Menu>
    </MenuTrigger>
  );
}
