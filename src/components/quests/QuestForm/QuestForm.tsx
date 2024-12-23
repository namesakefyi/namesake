import "survey-core/defaultV2.min.css";

import { Link } from "@/components/common";
import type { Doc, Id } from "@convex/_generated/dataModel";
import { ArrowRight, Pencil, Plus } from "lucide-react";

export type QuestFormProps = {
  quest: Doc<"quests">;
  editable?: boolean;
};

export const EditButton = ({
  isNew,
  questId,
}: { isNew: boolean; questId: Id<"quests"> }) => {
  const { buttonText, Icon } = isNew
    ? { buttonText: "Create form", Icon: Plus }
    : { buttonText: "Edit form", Icon: Pencil };

  return (
    <Link
      href={{
        to: "/admin/quests/$questId/form",
        params: { questId },
      }}
      button={{ variant: "secondary", size: "large" }}
    >
      <Icon size={18} strokeWidth="2.5" /> {buttonText}
    </Link>
  );
};

export const QuestForm = ({ quest, editable }: QuestFormProps) => {
  if (!quest.formSchema && !editable) return null;

  return editable ? (
    <EditButton isNew={!quest.formSchema} questId={quest._id} />
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
