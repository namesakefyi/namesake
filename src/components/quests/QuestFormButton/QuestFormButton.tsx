import { Button, Link } from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc, Id } from "@convex/_generated/dataModel";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { ArrowRight, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export type QuestFormButtonProps = {
  quest: Doc<"quests">;
  editable?: boolean;
};

const EditButton = ({
  isNew,
  questId,
}: { isNew: boolean; questId: Id<"quests"> }) => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const createForm = useMutation(api.forms.create);
  const createPage = useMutation(api.formPages.create);

  const handleFormCreation = async () => {
    try {
      setIsCreating(true);
      const formId = await createForm({ questId: questId as Id<"quests"> });
      await createPage({ formId, title: "" }).then(() => {
        navigate({ to: "/quests/$questId/edit/form", params: { questId } });
      });
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsCreating(false);
    }
  };

  if (isNew) {
    return (
      <Button
        onPress={handleFormCreation}
        icon={Plus}
        size="large"
        isDisabled={isCreating}
      >
        Create form
      </Button>
    );
  }

  return (
    <Link
      href={{
        to: "/quests/$questId/edit/form",
        params: { questId },
      }}
      button={{ variant: "secondary", size: "large" }}
    >
      <Pencil size={16} />
      Edit form
    </Link>
  );
};

export const QuestFormButton = ({ quest, editable }: QuestFormButtonProps) => {
  if (!quest.formId && !editable) return null;

  return editable ? (
    <EditButton isNew={!quest.formId} questId={quest._id} />
  ) : (
    <Link
      href={{
        to: "/quests/$questId/form",
        params: { questId: quest._id },
      }}
      button={{ variant: "primary", size: "large" }}
    >
      Get Started
      <ArrowRight size={18} className="-mr-1" strokeWidth="2.5" />
    </Link>
  );
};
