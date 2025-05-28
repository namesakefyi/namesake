import { PageHeader, type PageHeaderProps } from "@/components/app";
import { Button, Link, Tooltip, TooltipTrigger } from "@/components/common";
import {
  EditQuestTitleModal,
  QuestPageBadges,
  QuestPageToolbar,
  StatusSelect,
} from "@/components/quests";
import type { Status } from "@/constants";
import { api } from "@convex/_generated/api";
import type { Doc, Id } from "@convex/_generated/dataModel";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface QuestPageHeaderProps extends Omit<PageHeaderProps, "title"> {
  quest?: Doc<"quests"> | null;
  userQuest?: Doc<"userQuests"> | null;
  editable?: boolean;
}

export function QuestPageHeader({
  quest,
  userQuest,
  editable,
}: QuestPageHeaderProps) {
  const navigate = useNavigate();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const changeStatus = useMutation(api.userQuests.setStatus);
  const deleteForever = useMutation(api.userQuests.deleteForever);
  const addQuest = useMutation(api.userQuests.create);

  if (!quest) return null;

  const handleAddQuest = async () => {
    try {
      setIsSubmitting(true);
      if (quest) await addQuest({ questId: quest._id });
    } catch (err) {
      toast.error("Failed to add quest. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveQuest = (questId: Id<"quests">, title: string) => {
    deleteForever({ questId }).then(() => {
      toast(`Removed ${title} from my list`);
      navigate({ to: "/" });
    });
  };

  const handleStatusChange = (status: Status) => {
    if (quest) changeStatus({ questId: quest._id, status });
  };

  const editTitleButton = (
    <>
      <TooltipTrigger>
        <Button
          variant="icon"
          size="small"
          icon={Pencil}
          aria-label="Edit title"
          onPress={() => setIsEditingTitle(true)}
        />
        <Tooltip placement="right">Edit title</Tooltip>
      </TooltipTrigger>
      <EditQuestTitleModal
        quest={quest}
        open={isEditingTitle}
        onOpenChange={setIsEditingTitle}
      />
    </>
  );

  return (
    <>
      <PageHeader
        title={quest.title}
        badge={editable ? editTitleButton : undefined}
        mobileBackLink={{ to: "/" }}
      >
        {quest && userQuest && !editable && (
          <StatusSelect
            status={userQuest.status as Status}
            onChange={handleStatusChange}
            onRemove={() => handleRemoveQuest(quest._id, quest.title)}
          />
        )}
        {!userQuest && !editable && (
          <Button
            onClick={handleAddQuest}
            size="small"
            isSubmitting={isSubmitting}
          >
            Add to my quests
          </Button>
        )}
        {editable && (
          <div className="flex gap-4 items-center">
            <Link
              button={{ variant: "secondary", size: "small" }}
              href={{
                to: "/quests/$questSlug",
                params: { questSlug: quest?.slug },
              }}
            >
              Finish editing
            </Link>
          </div>
        )}
      </PageHeader>
      <QuestPageBadges quest={quest} editable={editable} />
      <QuestPageToolbar quest={quest} isEditing={editable} />
    </>
  );
}
