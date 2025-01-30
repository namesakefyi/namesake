import {
  Button,
  Disclosure,
  Empty,
  Form,
  Menu,
  MenuItem,
  MenuTrigger,
  RichText,
  TextField,
} from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc, Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { CircleHelp, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { QuestSection } from "../QuestSection/QuestSection";

type EditFaqFormProps = {
  faq?: Doc<"questFaqs">;
  onSubmit: ({
    question,
    answer,
  }: { question: string; answer: string }) => void;
  onCancel: () => void;
};

const EditFaqForm = ({ faq, onSubmit, onCancel }: EditFaqFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [question, setQuestion] = useState(faq?.question || "");
  const [answer, setAnswer] = useState(faq?.answer || "");

  const handleCancel = () => {
    setQuestion(faq?.question || "");
    setAnswer(faq?.answer || "");
    onCancel();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      onSubmit({ question, answer });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="border border-gray-dim rounded-xl shadow p-4 mb-6 gap-2 w-full"
    >
      <TextField
        value={question}
        onChange={setQuestion}
        type="text"
        aria-label="Question"
        className="w-full"
        size="large"
        autoFocus
        placeholder="Write a question..."
      />
      <RichText
        initialContent={answer}
        onChange={setAnswer}
        className="flex-1"
        placeholder="Write an answer..."
      />
      <div className="flex gap-1 justify-end">
        <Button
          type="button"
          variant="secondary"
          onPress={handleCancel}
          isDisabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" isDisabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </Form>
  );
};

type QuestFaqProps = {
  questId: Id<"quests">;
  faq: Doc<"questFaqs">;
  editable?: boolean;
};

const QuestFaq = ({ questId, faq, editable }: QuestFaqProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const updateFaq = useMutation(api.questFaqs.update);
  const deleteFaq = useMutation(api.quests.deleteFaq);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteFaq({ questId: questId, questFaqId: faq._id });
  };

  const handleSave = ({
    question,
    answer,
  }: { question: string; answer: string }) => {
    try {
      updateFaq({ questFaqId: faq._id, question, answer });
      setIsEditing(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  };

  return (
    <div className="flex gap-1 items-start justify-between">
      {isEditing ? (
        <EditFaqForm faq={faq} onSubmit={handleSave} onCancel={handleCancel} />
      ) : (
        <Disclosure
          title={faq.question}
          id={faq._id}
          className="w-full"
          actions={
            editable &&
            !isEditing && (
              <MenuTrigger>
                <Button
                  type="button"
                  variant="icon"
                  size="small"
                  icon={MoreHorizontal}
                />
                <Menu placement="bottom end">
                  <MenuItem onAction={handleEdit}>Edit</MenuItem>
                  <MenuItem onAction={handleDelete}>Delete</MenuItem>
                </Menu>
              </MenuTrigger>
            )
          }
        >
          <div className="border-l border-gray-dim pl-4">
            <RichText initialContent={faq.answer} editable={false} />
          </div>
        </Disclosure>
      )}
    </div>
  );
};

type QuestFaqsProps = {
  quest: Doc<"quests">;
  editable?: boolean;
};

export const QuestFaqs = ({ quest, editable = false }: QuestFaqsProps) => {
  const [isAddingNew, setIsAddingNew] = useState(false);

  const faqs = useQuery(api.questFaqs.getByIds, { questFaqIds: quest.faqs });
  const addFaq = useMutation(api.quests.addFaq);

  const handleCancel = () => {
    setIsAddingNew(false);
  };

  const handleCreate = async ({
    question,
    answer,
  }: { question: string; answer: string }) => {
    await addFaq({
      questId: quest._id,
      question,
      answer,
    });
    setIsAddingNew(false);
  };

  if (!editable && !quest.faqs) return null;

  const hasFaqs = faqs && faqs.length > 0;

  return (
    <QuestSection
      title="Questions"
      action={
        editable && !isAddingNew
          ? {
              children: "Add question",
              onPress: () => setIsAddingNew(true),
            }
          : undefined
      }
    >
      {editable && isAddingNew && (
        <EditFaqForm onSubmit={handleCreate} onCancel={handleCancel} />
      )}
      {!hasFaqs ? (
        <Empty title="No questions" icon={CircleHelp} />
      ) : (
        <div className="flex flex-col">
          {faqs.map((faq) => (
            <QuestFaq
              questId={quest._id}
              key={faq._id}
              faq={faq}
              editable={editable}
            />
          ))}
        </div>
      )}
    </QuestSection>
  );
};
