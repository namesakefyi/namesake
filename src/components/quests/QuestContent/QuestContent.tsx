import {
  Button,
  Form,
  RichText,
  type RichTextProps,
} from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

interface QuestContentProps extends RichTextProps {
  quest: Doc<"quests">;
  editable?: boolean;
}

export function QuestContent({ quest, editable, ...props }: QuestContentProps) {
  const [content, setContent] = useState<string | undefined>(quest.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const update = useMutation(api.quests.setContent);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      if (content) {
        update({ questId: quest._id, content });
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return editable ? (
    <Form onSubmit={handleSubmit}>
      <RichText
        initialContent={content}
        onUpdate={(props) => setContent(props.editor.getHTML())}
        {...props}
      />
      <Button
        type="submit"
        variant="primary"
        className="self-end"
        isDisabled={isSubmitting}
      >
        Save
      </Button>
    </Form>
  ) : (
    <RichText initialContent={quest.content} editable={false} {...props} />
  );
}
