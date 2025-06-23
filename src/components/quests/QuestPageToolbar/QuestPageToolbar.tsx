import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { Authenticated, useQuery } from "convex/react";
import { Clock, Pencil } from "lucide-react";
import { IconText, Link, TimeAgo } from "@/components/common";

interface QuestPageToolbarProps {
  quest?: Doc<"quests"> | null;
  isEditing?: boolean;
}

export const QuestPageToolbar = ({
  quest,
  isEditing,
}: QuestPageToolbarProps) => {
  const user = useQuery(api.users.getCurrent);
  const canEdit = user?.role === "admin";
  const updatedTime = quest?.updatedAt ? (
    <TimeAgo date={new Date(quest.updatedAt)} />
  ) : (
    "some time ago"
  );

  if (isEditing) return null;

  return (
    <div
      className="flex items-center justify-between h-12 py-1 -mt-2 w-full overflow-x-auto border-b border-dim"
      role="toolbar"
    >
      <IconText icon={Clock}>Last edited {updatedTime}</IconText>
      <Authenticated>
        {!isEditing && canEdit && (
          <Link
            button={{ size: "small", variant: "ghost" }}
            href={{
              to: "/quests/$questSlug/edit",
              params: { questSlug: quest?.slug },
            }}
          >
            <Pencil className="size-3.5" /> Edit
          </Link>
        )}
      </Authenticated>
    </div>
  );
};
