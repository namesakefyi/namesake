import { Button, Link } from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ArrowRight, LoaderCircle, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AddOrGoToQuestButtonProps {
  quest: Doc<"quests">;
  size?: "small" | "medium";
  className?: string;
}

export function AddOrGoToQuestButton({
  quest,
  size = "medium",
  className,
}: AddOrGoToQuestButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const addQuest = useMutation(api.userQuests.create);
  const userQuest = useQuery(api.userQuests.getByQuestId, {
    questId: quest._id,
  });

  if (quest === undefined) return null;
  if (quest === null) return null;

  const handleAddQuest = () => {
    setIsAdding(true);
    addQuest({ questId: quest._id })
      .then(() => {
        toast.success(`Added ${quest.title} quest`);
      })
      .then(() => setIsAdding(false));
  };

  if (userQuest === undefined) return null;

  if (!userQuest) {
    return (
      <Button
        onPress={handleAddQuest}
        isDisabled={isAdding}
        aria-label={isAdding ? "Adding" : "Add quest"}
        size={size}
        variant={size === "small" ? "secondary" : "primary"}
        className={className}
      >
        {isAdding ? (
          <LoaderCircle size={16} className="animate-spin" />
        ) : (
          <Plus size={16} />
        )}
        Add
      </Button>
    );
  }

  return (
    <Link
      href={{ to: "/quests/$questId", params: { questId: quest._id } }}
      button={{ variant: "secondary", size }}
      aria-label="Go to quest"
      className={className}
    >
      {size === "small" ? <ArrowRight size={16} /> : "Go to quest"}
    </Link>
  );
}
