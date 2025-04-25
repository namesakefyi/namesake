import { Editor, type EditorProps } from "@/components/common";
import type { Doc } from "@convex/_generated/dataModel";
import { useState } from "react";

interface QuestContentProps extends EditorProps {
  quest: Doc<"quests">;
  editable?: boolean;
}

export function QuestContent({
  quest,
  editable = false,
  ...props
}: QuestContentProps) {
  const [content, setContent] = useState(quest.content);

  return (
    <Editor
      {...props}
      initialContent={content}
      editable={editable}
      onUpdate={(props) => {
        setContent(props.editor.getHTML());
      }}
    />
  );
}
