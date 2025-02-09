import { Empty } from "@/components/common";
import {
  DocumentCard,
  EditQuestDocumentModal,
  QuestSection,
} from "@/components/quests";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { FileIcon } from "lucide-react";
import { useState } from "react";

type QuestDocumentsProps = {
  quest: Doc<"quests">;
  editable?: boolean;
};

export const QuestDocuments = ({ quest, editable }: QuestDocumentsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const documents = useQuery(api.documents.getByQuestId, {
    questId: quest._id,
  });

  const hasDocuments = documents && documents.length > 0;

  if (!hasDocuments && !editable) return null;

  return (
    <QuestSection
      title="Documents"
      action={
        editable
          ? {
              children: "Add document",
              onPress: () => setIsEditing(true),
            }
          : undefined
      }
    >
      {editable && (
        <EditQuestDocumentModal
          quest={quest}
          isOpen={isEditing}
          onOpenChange={setIsEditing}
        />
      )}
      {!hasDocuments ? (
        <Empty title="No documents" icon={FileIcon} />
      ) : (
        <div className="flex gap-4 overflow-x-auto p-4 -m-4">
          {documents?.map((document) => (
            <DocumentCard
              key={document._id}
              title={document.title}
              code={document.code}
              downloadUrl={document.url ?? undefined}
            />
          ))}
        </div>
      )}
    </QuestSection>
  );
};
