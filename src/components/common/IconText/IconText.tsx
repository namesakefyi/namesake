import type { LucideIcon } from "lucide-react";

export interface IconTextProps {
  icon: LucideIcon;
  children: React.ReactNode;
}

export function IconText({ icon: Icon, children }: IconTextProps) {
  return (
    <span className="text-gray-dim text-sm flex items-center gap-1.5">
      <Icon size={14} />
      <span>{children}</span>
    </span>
  );
}
