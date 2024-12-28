import { Badge, Button, Tooltip, TooltipTrigger } from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DocumentCard } from "../DocumentCard";
import { EditQuestDocumentModal } from "../EditQuestDocumentModal/EditQuestDocumentModal";

type QuestDocumentsProps = {
  quest: Doc<"quests">;
  editable?: boolean;
};

export const QuestDocuments = ({ quest, editable }: QuestDocumentsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const documents = useQuery(api.documents.getByQuestId, {
    questId: quest._id,
  });

  if ((!documents || documents.length === 0) && !editable) return null;

  return (
    <div className="p-4 rounded-lg border border-gray-dim">
      <header className="flex gap-1 items-center pb-4">
        <h3 className="text-gray-dim text-sm">Documents</h3>
        <Badge size="xs" className="rounded-full">
          {documents?.length || 0}
        </Badge>
        {editable && (
          <>
            <TooltipTrigger>
              <Button
                onPress={() => setIsEditing(true)}
                variant="ghost"
                icon={Plus}
                size="small"
                aria-label="Add document"
              />
              <Tooltip>Add document</Tooltip>
            </TooltipTrigger>
            <EditQuestDocumentModal
              quest={quest}
              isOpen={isEditing}
              onOpenChange={setIsEditing}
            />
          </>
        )}
      </header>
      <div className="flex gap-4 overflow-x-auto p-4 -m-4">
        {documents?.map((document) => (
          <DocumentCard
            key={document._id}
            title={document.title}
            code={document.code}
            downloadUrl={document.url ?? undefined}
          />
        ))}
        {editable && documents?.length === 0 && (
          <Button onPress={() => setIsEditing(true)}>Uplaod document</Button>
        )}
      </div>
    </div>
  );
};
