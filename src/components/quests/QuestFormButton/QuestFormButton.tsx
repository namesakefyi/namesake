import { Link } from "@/components/common";
import type { Doc } from "@convex/_generated/dataModel";
import { ArrowRight } from "lucide-react";

export type QuestFormButtonProps = {
  quest: Doc<"quests">;
};

export const QuestFormButton = ({ quest }: QuestFormButtonProps) => {
  if (!quest) return null;

  return (
    // TODO: Link form to quest
    <Link
      href={{
        to: "/forms/ma/court-order",
        params: { questId: quest._id },
      }}
      button={{ variant: "primary", size: "large" }}
    >
      Get Started
      <ArrowRight size={18} className="-mr-1" strokeWidth="2.5" />
    </Link>
  );
};
