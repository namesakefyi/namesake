import { PageHeader } from "@/components/app";
import {
  Badge,
  Banner,
  Button,
  Disclosure,
  Form,
  RichText,
  Select,
  SelectItem,
  TextField,
} from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { JURISDICTIONS, type Jurisdiction } from "@convex/constants";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { Key } from "react-aria";
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
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const faqs = useQuery(api.faqs.getAll);
  const create = useMutation(api.faqs.create);
  const deleteForever = useMutation(api.faqs.deleteForever);

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setJurisdiction(null);
    setError(null);
  };

  const handleJurisdictionChange = (key: Key) => {
    setJurisdiction(key as Jurisdiction);
  };

  const handleCancel = () => {
    setIsAdding(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      await create({
        question,
        answer,
        jurisdiction: jurisdiction ?? undefined,
      });
      setIsAdding(false);
      toast.success("Question added");
      resetForm();
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
          <div className="flex gap-2 justify-between">
            <Select
              aria-label="State"
              name="jurisdiction"
              selectedKey={jurisdiction}
              onSelectionChange={handleJurisdictionChange}
              placeholder="Select a state"
              className="flex-[0.5]"
            >
              {Object.entries(JURISDICTIONS).map(([value, label]) => (
                <SelectItem key={value} id={value}>
                  {label}
                </SelectItem>
              ))}
            </Select>
            <div className="flex gap-2">
              <Button onPress={handleCancel}>Cancel</Button>
              <Button type="submit" isDisabled={isSubmitting} variant="primary">
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </Form>
      )}
      {faqs?.map((faq) => (
        <Disclosure key={faq._id} id={faq._id} title={faq.question}>
          {faq.jurisdiction && (
            <Badge>{JURISDICTIONS[faq.jurisdiction as Jurisdiction]}</Badge>
          )}
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
