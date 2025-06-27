import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Milestone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Button,
  Editor,
  type EditorProps,
  Empty,
  Form,
} from "@/components/common";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const save = useMutation(api.quests.setContent);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content) return;

    try {
      setIsSubmitting(true);
      await save({ questId: quest._id, content });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!content && !editable) {
    return <Empty title="There's not much here" icon={Milestone} />;
  }

  return (
    <div className="flex flex-col gap-3">
      <Editor
        {...props}
        initialContent={content}
        editable={editable}
        onUpdate={(props) => {
          setContent(props.editor.getHTML());
        }}
      />
      {editable && (
        <Form className="flex justify-end" onSubmit={handleSubmit}>
          <Button
            type="submit"
            variant="primary"
            className="ml-auto"
            isDisabled={content === quest.content}
            isSubmitting={isSubmitting}
          >
            Save Changes
          </Button>
        </Form>
      )}
    </div>
  );
}
