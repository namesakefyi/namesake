import { Editor, type EditorProps } from "@/components/common";
import type { Doc } from "@convex/_generated/dataModel";

interface QuestContentProps extends EditorProps {
  quest: Doc<"quests">;
  editable?: boolean;
}

export function QuestContent({
  quest,
  editable = false,
  ...props
}: QuestContentProps) {
  return (
    <Editor {...props} initialContent={quest.content} editable={editable} />
  );
}
