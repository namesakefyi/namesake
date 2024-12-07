import { Badge } from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { DocumentCard } from "../DocumentCard";

type QuestDocumentsProps = {
  questId: Id<"quests">;
};

export const QuestDocuments = ({ questId }: QuestDocumentsProps) => {
  const documents = useQuery(api.documents.getByQuestId, {
    questId,
  });

  if (!documents || documents.length === 0) return null;

  return (
    <div className="p-4 rounded-lg border border-gray-dim mb-8">
      <header className="flex gap-1 items-center pb-4">
        <h3 className="text-gray-dim text-sm">Documents</h3>
        <Badge size="xs" className="rounded-full">
          {documents.length}
        </Badge>
      </header>
      <div className="flex gap-4 overflow-x-auto p-4 -m-4">
        {documents.map((document) => (
          <DocumentCard
            key={document._id}
            title={document.title}
            code={document.code}
            downloadUrl={document.url ?? undefined}
          />
        ))}
      </div>
    </div>
  );
};
