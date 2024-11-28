import { Badge } from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { DocumentCard } from "../DocumentCard";

type QuestFormsProps = {
  questId: Id<"quests">;
};

export const QuestForms = ({ questId }: QuestFormsProps) => {
  const forms = useQuery(api.forms.getFormsForQuest, {
    questId,
  });

  if (!forms || forms.length === 0) return null;

  return (
    <div className="p-4 rounded-lg border border-gray-dim mb-8">
      <header className="flex gap-1 items-center pb-4">
        <h3 className="text-gray-dim text-sm">Forms</h3>
        <Badge size="xs" className="rounded-full">
          {forms.length}
        </Badge>
      </header>
      <div className="flex gap-4 overflow-x-auto p-4 -m-4">
        {forms.map((form) => (
          <DocumentCard
            key={form._id}
            title={form.title}
            formCode={form.formCode}
            downloadUrl={form.url ?? undefined}
          />
        ))}
      </div>
    </div>
  );
};
