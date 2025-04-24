import { IconText, Link, TimeAgo } from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { Authenticated, useQuery } from "convex/react";
import { Clock, Pencil } from "lucide-react";
import { tv } from "tailwind-variants";

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

  const toolbarStyles = tv({
    base: "flex app-padding items-center justify-between h-12 pb-2 w-full overflow-x-auto border-b border-gray-dim",
    variants: {
      isEditing: {
        true: "bg-app sticky-top-header z-20",
      },
    },
  });

  return (
    <div className={toolbarStyles({ isEditing })} role="toolbar">
      <div className="flex gap-2 items-center">
        {isEditing ? (
          <IconText icon={Pencil} className="text-amber-9">
            Editing
          </IconText>
        ) : (
          <IconText icon={Clock}>Last edited {updatedTime}</IconText>
        )}
      </div>
      <Authenticated>
        {isEditing && (
          <div className="flex gap-4 items-center">
            <Link
              button={{ size: "small", variant: "success" }}
              href={{
                search: { edit: undefined },
              }}
            >
              Save changes
            </Link>
          </div>
        )}
        {!isEditing && canEdit && (
          <Link
            button={{ size: "small", variant: "ghost" }}
            href={{
              search: { edit: true },
            }}
          >
            <Pencil className="size-3.5" /> Edit
          </Link>
        )}
      </Authenticated>
    </div>
  );
};
