import {
  Button,
  FileTrigger,
  Form,
  Modal,
  ModalFooter,
  ModalHeader,
  TextField,
} from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

interface EditQuestDocumentModalProps {
  quest: Doc<"quests">;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditQuestDocumentModal({
  quest,
  isOpen,
  onOpenChange,
}: EditQuestDocumentModalProps) {
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const uploadPDF = useMutation(api.documents.upload);
  const createDocument = useMutation(api.documents.create);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");

  const clearForm = () => {
    setFile(null);
    setTitle("");
    setCode("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (file === null) throw new Error("File is required");

    setIsSubmitting(true);
    try {
      const documentId = await createDocument({
        title,
        code,
        questId: quest._id,
      });

      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      await uploadPDF({ documentId, storageId });
      toast.success("Document uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload document");
    } finally {
      setIsSubmitting(false);
      clearForm();
      onOpenChange(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalHeader title="Upload Document" />
      <Form onSubmit={handleSubmit} className="w-full">
        <TextField
          label="Title"
          value={title}
          onChange={setTitle}
          autoFocus
          isRequired
          className="w-full"
        />
        <TextField label="Code" value={code} onChange={setCode} />
        <FileTrigger
          acceptedFileTypes={["application/pdf"]}
          onSelect={(e) => {
            if (e === null) return;
            const files = Array.from(e);
            setFile(files[0]);
          }}
        >
          <Button type="button" variant="secondary">
            {file ? file.name : "Select PDF"}
          </Button>
        </FileTrigger>
        <ModalFooter>
          <Button
            type="button"
            variant="secondary"
            onPress={() => onOpenChange(false)}
            isDisabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isDisabled={isSubmitting}>
            Upload
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
}
