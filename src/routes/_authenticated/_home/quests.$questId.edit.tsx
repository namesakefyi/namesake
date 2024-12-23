import { AppContent, PageHeader } from "@/components/app";
import { Badge, Empty, Link, RichText } from "@/components/common";
import {
  QuestCosts,
  QuestForm,
  QuestTimeRequired,
  QuestUrls,
} from "@/components/quests";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { Check, LoaderCircle, Milestone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute(
  "/_authenticated/_home/quests/$questId/edit",
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
      <PageHeader
        title={quest.title}
        badge={quest.jurisdiction && <Badge>{quest.jurisdiction}</Badge>}
      >
        <Link
          href={{ to: "/quests/$questId", params: { questId: quest._id } }}
          button={{ variant: "ghost" }}
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
      </PageHeader>
      <div className="flex gap-4 mb-4">
        <QuestCosts quest={quest} editable />
        <QuestTimeRequired quest={quest} editable />
      </div>
      <QuestUrls urls={quest.urls} />
      <RichText initialContent={quest.content} onChange={setContent} />
      <QuestForm quest={quest} editable />
    </AppContent>
  );
}
