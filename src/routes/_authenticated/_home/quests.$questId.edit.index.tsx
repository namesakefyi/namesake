import { AppContent } from "@/components/app";
import {
  Button,
  Empty,
  Link,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import {
  EditQuestBasicsModal,
  QuestContent,
  QuestCosts,
  QuestDetails,
  QuestDocuments,
  QuestFormButton,
  QuestPageHeader,
  QuestTimeRequired,
  QuestUrls,
} from "@/components/quests";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { Check, LoaderCircle, Milestone, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute(
  "/_authenticated/_home/quests/$questId/edit/",
)({
  beforeLoad: ({ context }) => {
    const isAdmin = context.role === "admin";

    // For now, only admins can edit quests
    if (!isAdmin) {
      throw redirect({
        to: "/",
        statusCode: 401,
        replace: true,
      });
    }
  },
  component: QuestEditRoute,
});

function QuestEditRoute() {
  const { questId } = Route.useParams();
  const [isEditing, setIsEditing] = useState(false);

  const quest = useQuery(api.quests.getById, {
    questId: questId as Id<"quests">,
  });

  const [content, setContent] = useState(quest?.content ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const updateContent = useMutation(api.quests.setContent);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateContent({
        questId: questId as Id<"quests">,
        content,
      });
      navigate({
        to: "/quests/$questId",
        params: { questId: questId as Id<"quests"> },
      });
    } catch (err) {
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  // TODO: Improve loading state to prevent flash of empty
  if (quest === undefined) return;
  if (quest === null) return <Empty title="Quest not found" icon={Milestone} />;

  return (
    <AppContent>
      <QuestPageHeader
        quest={quest}
        badge={
          <TooltipTrigger>
            <Button
              variant="icon"
              size="small"
              icon={Pencil}
              onPress={() => setIsEditing(true)}
              aria-label="Edit details"
            />
            <Tooltip>Edit details</Tooltip>
          </TooltipTrigger>
        }
      >
        <Link
          href={{ to: "/quests/$questId", params: { questId: quest._id } }}
          button={{ variant: "primary" }}
          onPress={handleSave}
          isDisabled={isSaving}
        >
          {isSaving ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Check size={16} />
          )}
          Save
        </Link>
        <EditQuestBasicsModal
          quest={quest}
          open={isEditing}
          onOpenChange={setIsEditing}
        />
      </QuestPageHeader>
      <div className="flex flex-col gap-6">
        <QuestDetails>
          <QuestCosts quest={quest} editable />
          <QuestTimeRequired quest={quest} editable />
        </QuestDetails>
        <QuestDocuments quest={quest} editable />
        <QuestUrls urls={quest.urls} />
        <QuestContent initialContent={quest.content} onChange={setContent} />
        <QuestFormButton quest={quest} editable />
      </div>
    </AppContent>
  );
}
