import "survey-core/defaultV2.min.css";

import { Link } from "@/components/common";
import type { Doc, Id } from "@convex/_generated/dataModel";
import { Pencil, Plus } from "lucide-react";
import { Heading } from "react-aria-components";

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
      button={{ variant: "secondary" }}
    >
      <Icon size={16} /> {buttonText}
    </Link>
  );
};

export const QuestForm = ({ quest, editable }: QuestFormProps) => {
  if (!quest.formSchema && !editable) return null;

  return (
    <div className="rounded-lg border border-gray-dim flex items-center justify-between gap-4 p-4 mb-4">
      <div className="flex flex-col">
        <Heading className="text-lg">Answer questions</Heading>
        <p className="text-gray-dim">
          We'll walk you through the steps to fill out your forms.
        </p>
      </div>
      {editable ? (
        <EditButton isNew={!quest.formSchema} questId={quest._id} />
      ) : (
        <Link
          href={{
            to: "/quests/$questId/form",
            params: { questId: quest._id },
          }}
          button={{ variant: "secondary" }}
        >
          Get Started
        </Link>
      )}
    </div>
  );
};
