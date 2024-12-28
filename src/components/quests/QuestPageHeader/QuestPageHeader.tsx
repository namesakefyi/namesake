import { PageHeader, type PageHeaderProps } from "@/components/app";
import { Badge } from "@/components/common";
import type { Doc } from "@convex/_generated/dataModel";

interface QuestPageHeaderProps extends Omit<PageHeaderProps, "title"> {
  quest?: Doc<"quests"> | null;
}

export function QuestPageHeader({
  quest,
  badge,
  icon: Icon,
  children,
  className,
}: QuestPageHeaderProps) {
  return (
    <PageHeader
      title={quest === null ? "Unknown" : (quest?.title ?? "")}
      icon={Icon}
      badge={
        <>
          {quest?.jurisdiction && <Badge>{quest.jurisdiction}</Badge>}
          {badge}
        </>
      }
      className={className}
    >
      {children}
    </PageHeader>
  );
}
