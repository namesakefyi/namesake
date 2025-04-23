import type { PageHeaderProps } from "@/components/app";
import { Badge, IconText, Link, TimeAgo } from "@/components/common";
import { QuestCosts, QuestTimeRequired } from "@/components/quests";
import { useIsMobile } from "@/utils/useIsMobile";
import { api } from "@convex/_generated/api";
import type { Doc, Id } from "@convex/_generated/dataModel";
import type { Status } from "@convex/constants";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Authenticated, useMutation, useQuery } from "convex/react";
import { ArrowLeft, Clock, Pencil } from "lucide-react";
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
    <div className="flex items-center justify-between h-9 pb-1 w-full">
      <div className="flex gap-2 items-center">
        <IconText icon={Clock}>Last edited {updatedTime}</IconText>
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
  const isMobile = useIsMobile();
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
    <div className="pt-8 mb-6 flex flex-col gap-2 items-start w-full border-b border-gray-dim">
      <div className="flex gap-1 items-center">
        {badge && <Badge>{badge}</Badge>}
        <QuestCosts quest={quest} editable={isEditing} />
        <QuestTimeRequired quest={quest} editable={isEditing} />
      </div>
      <div className="flex gap-2 items-center">
        {isMobile && (
          <Link button={{ variant: "icon" }} href={{ to: "/" }}>
            <ArrowLeft className="size-6" />
          </Link>
        )}
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
  );
}
