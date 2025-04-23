import type { PageHeaderProps } from "@/components/app";
import { Badge, IconText, Link, TimeAgo } from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc, Id } from "@convex/_generated/dataModel";
import type { Status } from "@convex/constants";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Authenticated, useMutation, useQuery } from "convex/react";
import { Clock, Pencil } from "lucide-react";
import { Heading } from "react-aria-components";
import { toast } from "sonner";
import { StatusSelect } from "../StatusSelect/StatusSelect";

interface QuestPageToolbarProps {
  quest?: Doc<"quests"> | null;
  isEditing?: boolean;
}

function QuestPageToolbar({ quest, isEditing }: QuestPageToolbarProps) {
  const user = useQuery(api.users.getCurrent);
  const canEdit = user?.role === "admin";
  const updatedTime = quest?.updatedAt ? (
    <TimeAgo date={new Date(quest.updatedAt)} />
  ) : (
    "some time ago"
  );

  return (
    <div className="flex items-center justify-between h-12 w-full border-b border-t border-gray-dim">
      <div className="flex gap-2 items-center">
        <IconText icon={Clock}>Updated {updatedTime}</IconText>
      </div>
      <Authenticated>
        {isEditing && (
          <div className="flex gap-4 items-center">
            <IconText icon={Pencil}>Editing</IconText>
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
}

interface QuestPageHeaderProps extends Omit<PageHeaderProps, "title"> {
  quest?: Doc<"quests"> | null;
  userQuest?: Doc<"userQuests"> | null;
}

export function QuestPageHeader({
  quest,
  userQuest,
  badge,
  children,
}: QuestPageHeaderProps) {
  const navigate = useNavigate();
  const changeStatus = useMutation(api.userQuests.setStatus);
  const deleteForever = useMutation(api.userQuests.deleteForever);
  const search = useSearch({
    strict: false,
  });
  const isEditing = search.edit;

  const handleRemoveQuest = (questId: Id<"quests">, title: string) => {
    deleteForever({ questId }).then(() => {
      toast(`Removed ${title} from my list`);
      navigate({ to: "/" });
    });
  };

  const handleStatusChange = (status: Status) => {
    if (quest) changeStatus({ questId: quest._id, status });
  };

  return (
    <div className="relative flex gap-2 items-end mb-6 pt-8 w-full">
      <div className="flex flex-col gap-1 items-start w-full">
        {badge && <Badge>{badge}</Badge>}
        <div className="flex gap-2 items-center pb-2">
          <Heading className="text-4xl font-medium">{quest?.title}</Heading>
          <div className="flex gap-2 items-center -mb-1">
            {quest && userQuest && !isEditing && (
              <StatusSelect
                status={userQuest.status as Status}
                onChange={handleStatusChange}
                onRemove={() => handleRemoveQuest(quest._id, quest.title)}
              />
            )}
            {children}
          </div>
        </div>
        <QuestPageToolbar quest={quest} isEditing={isEditing} />
      </div>
    </div>
  );
}
