import type { LucideIcon } from "lucide-react";
import { tv } from "tailwind-variants";

export interface IconTextProps {
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function IconText({ icon: Icon, children, className }: IconTextProps) {
  const styles = tv({
    base: "text-gray-dim text-sm flex items-center gap-1.5",
  });

  return (
    <span className={styles({ className })}>
      <Icon className="size-3.5 shrink-0" />
      <span>{children}</span>
    </span>
  );
}
