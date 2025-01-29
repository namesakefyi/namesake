import { PageHeader } from "@/components/app";
import {
  Banner,
  Button,
  Disclosure,
  Form,
  RichText,
  TextField,
} from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/faqs/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);

  const faqs = useQuery(api.faqs.getAll);
  const create = useMutation(api.faqs.create);
  const deleteForever = useMutation(api.faqs.deleteForever);

  const handleCancel = () => {
    setIsAdding(false);
    setQuestion("");
    setAnswer("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      await create({ question, answer });
      setIsAdding(false);
      toast.success("Question added");
      setQuestion("");
      setAnswer("");
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (faqId: Id<"faqs">) => {
    try {
      setIsDeleting(true);
      await deleteForever({ faqId });
      toast.success("Question deleted");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title="FAQs">
        <Button onPress={() => setIsAdding(true)} icon={Plus} variant="primary">
          New Question
        </Button>
      </PageHeader>
      {isAdding && (
        <Form
          onSubmit={handleSubmit}
          className="gap-4 border border-gray-dim p-4 rounded-xl shadow mb-8"
        >
          {error && <Banner variant="danger">{error}</Banner>}
          <TextField
            aria-label="Question"
            name="question"
            value={question}
            onChange={setQuestion}
            size="large"
            placeholder="Write a question..."
          />
          <RichText
            initialContent={answer}
            onChange={setAnswer}
            placeholder="Write an answer..."
          />
          <div className="flex gap-2 justify-end">
            <Button onPress={handleCancel}>Cancel</Button>
            <Button type="submit" isDisabled={isSubmitting} variant="primary">
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </Form>
      )}
      {faqs?.map((faq) => (
        <Disclosure key={faq._id} id={faq._id} title={faq.question}>
          <RichText initialContent={faq.answer} editable={false} />
          <time
            dateTime={new Date(faq.updatedAt).toLocaleString()}
            className="text-gray-dim italic text-sm"
          >
            Last updated {new Date(faq.updatedAt).toLocaleString()}
          </time>
          <Button
            size="small"
            onPress={() => handleDelete(faq._id)}
            isDisabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </Disclosure>
      ))}
    </>
  );
}
