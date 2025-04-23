import type { PageHeaderProps } from "@/components/app";
import {
  Button,
  IconText,
  Link,
  TimeAgo,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import {
  EditQuestTitleModal,
  QuestCategory,
  QuestCosts,
  QuestJurisdiction,
  QuestTimeRequired,
} from "@/components/quests";
import { useIsMobile } from "@/utils/useIsMobile";
import { api } from "@convex/_generated/api";
import type { Doc, Id } from "@convex/_generated/dataModel";
import type { Status } from "@convex/constants";
import { useNavigate } from "@tanstack/react-router";
import { Authenticated, useMutation, useQuery } from "convex/react";
import { ArrowLeft, Clock, Pencil } from "lucide-react";
import { useState } from "react";
import { Heading } from "react-aria-components";
import { toast } from "sonner";
import { StatusSelect } from "../StatusSelect/StatusSelect";

interface QuestPageToolbarProps {
  quest?: Doc<"quests"> | null;
  editable?: boolean;
}

function QuestPageToolbar({ quest, editable }: QuestPageToolbarProps) {
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
        {editable && (
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
        {!editable && canEdit && (
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
  editable?: boolean;
}

export function QuestPageHeader({
  quest,
  userQuest,
  editable,
  children,
}: QuestPageHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const changeStatus = useMutation(api.userQuests.setStatus);
  const deleteForever = useMutation(api.userQuests.deleteForever);

  if (!quest) return null;

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
    <div className="pt-6 mb-6 flex flex-col gap-2 items-start w-full border-b border-gray-dim">
      <div className="flex gap-1 items-center">
        <QuestCategory quest={quest} editable={editable} />
        <QuestJurisdiction quest={quest} editable={editable} />
        <QuestCosts quest={quest} editable={editable} />
        <QuestTimeRequired quest={quest} editable={editable} />
      </div>
      <div className="flex gap-2 items-center">
        {isMobile && (
          <Link button={{ variant: "icon" }} href={{ to: "/" }}>
            <ArrowLeft className="size-6" />
          </Link>
        )}
        <Heading className="text-4xl font-medium">{quest?.title}</Heading>
        {editable && (
          <>
            <TooltipTrigger>
              <Button
                variant="icon"
                size="small"
                icon={Pencil}
                onPress={() => setIsEditingTitle(true)}
              />
              <Tooltip placement="bottom">Edit title</Tooltip>
            </TooltipTrigger>
            <EditQuestTitleModal
              quest={quest}
              open={isEditingTitle}
              onOpenChange={setIsEditingTitle}
            />
          </>
        )}
        <div className="flex gap-2 items-center -mb-1">
          {quest && userQuest && !editable && (
            <StatusSelect
              status={userQuest.status as Status}
              onChange={handleStatusChange}
              onRemove={() => handleRemoveQuest(quest._id, quest.title)}
            />
          )}
          {children}
        </div>
      </div>
      <QuestPageToolbar quest={quest} editable={editable} />
    </div>
  );
}
