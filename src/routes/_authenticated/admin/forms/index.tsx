import { PageHeader } from "@/components/app";
import {
  Badge,
  Button,
  ComboBox,
  Empty,
  FileTrigger,
  Form,
  Menu,
  MenuItem,
  MenuTrigger,
  Modal,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  TextField,
} from "@/components/common";
import { api } from "@convex/_generated/api";
import type { DataModel, Id } from "@convex/_generated/dataModel";
import { JURISDICTIONS, type Jurisdiction } from "@convex/constants";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { Ellipsis, FileText, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/forms/")({
  component: FormsRoute,
});

const NewFormModal = ({
  isOpen,
  onOpenChange,
  onSubmit,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
}) => {
  const generateUploadUrl = useMutation(api.forms.generateUploadUrl);
  const uploadPDF = useMutation(api.forms.upload);
  const createForm = useMutation(api.forms.create);
  const quests = useQuery(api.quests.getAllActive);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [formCode, setFormCode] = useState("");
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction | null>(null);
  const [questId, setQuestId] = useState<Id<"quests"> | null>(null);

  const clearForm = () => {
    setFile(null);
    setTitle("");
    setFormCode("");
    setJurisdiction(null);
    setQuestId(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (jurisdiction === null) throw new Error("Jurisdiction is required");
    if (file === null) throw new Error("File is required");
    if (questId === null) throw new Error("Quest is required");

    setIsSubmitting(true);
    const formId = await createForm({ title, jurisdiction, formCode, questId });

    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await result.json();

    await uploadPDF({ formId, storageId });

    clearForm();
    onSubmit();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="w-full max-w-xl"
    >
      <Form onSubmit={handleSubmit} className="w-full">
        <TextField
          label="Title"
          value={title}
          onChange={setTitle}
          autoFocus
          isRequired
        />
        <TextField label="Form code" value={formCode} onChange={setFormCode} />
        <Select
          label="State"
          selectedKey={jurisdiction}
          onSelectionChange={(key) => setJurisdiction(key as Jurisdiction)}
          isRequired
        >
          {Object.entries(JURISDICTIONS).map(([key, value]) => (
            <SelectItem key={key} id={key}>
              {value}
            </SelectItem>
          ))}
        </Select>
        <ComboBox
          label="Quest"
          selectedKey={questId}
          onSelectionChange={(key) => setQuestId(key as Id<"quests">)}
          isRequired
        >
          {quests?.map((quest) => {
            const textValue = `${quest.title}${
              quest.jurisdiction ? ` (${quest.jurisdiction})` : ""
            }`;

            return (
              <SelectItem key={quest._id} id={quest._id} textValue={textValue}>
                {quest.title}{" "}
                {quest.jurisdiction && <Badge>{quest.jurisdiction}</Badge>}
              </SelectItem>
            );
          })}
        </ComboBox>
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
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onPress={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isDisabled={isSubmitting}>
            Create
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

const FormTableRow = ({ form }: { form: DataModel["forms"]["document"] }) => {
  const formUrl = useQuery(api.forms.getURL, { formId: form._id });
  const deleteForm = useMutation(api.forms.softDelete);
  const undeleteForm = useMutation(api.forms.undoSoftDelete);
  const deleteForeverForm = useMutation(api.forms.deleteForever);

  return (
    <TableRow
      key={form._id}
      className="flex gap-2 items-center"
      href={{ to: "/admin/forms/$formId", params: { formId: form._id } }}
    >
      <TableCell>
        <div>{form.title}</div>
        {form.deletionTime && (
          <span className="text-red-5" slot="description">
            {`deleted ${new Date(form.deletionTime).toLocaleString()}`}
          </span>
        )}
      </TableCell>
      <TableCell>
        {form.jurisdiction && <Badge>{form.jurisdiction}</Badge>}
      </TableCell>
      <TableCell>{new Date(form._creationTime).toLocaleString()}</TableCell>
      <TableCell>
        <MenuTrigger>
          <Button
            variant="icon"
            aria-label="Actions"
            size="small"
            icon={Ellipsis}
          />
          <Menu>
            {formUrl && (
              <MenuItem href={formUrl} target="_blank" rel="noreferrer">
                View PDF
              </MenuItem>
            )}
            {form.deletionTime ? (
              <>
                <MenuItem onAction={() => undeleteForm({ formId: form._id })}>
                  Undelete
                </MenuItem>
                {/* TODO: Add modal */}
                <MenuItem
                  onAction={() => deleteForeverForm({ formId: form._id })}
                >
                  Permanently Delete
                </MenuItem>
              </>
            ) : (
              <MenuItem onAction={() => deleteForm({ formId: form._id })}>
                Delete
              </MenuItem>
            )}
          </Menu>
        </MenuTrigger>
      </TableCell>
    </TableRow>
  );
};

function FormsRoute() {
  const [isNewFormModalOpen, setIsNewFormModalOpen] = useState(false);
  const forms = useQuery(api.forms.getAll);

  return (
    <div>
      <PageHeader title="Forms">
        <Button
          onPress={() => setIsNewFormModalOpen(true)}
          icon={Plus}
          variant="primary"
        >
          Upload New Form
        </Button>
      </PageHeader>
      <Table aria-label="Forms">
        <TableHeader>
          <TableColumn isRowHeader>Title</TableColumn>
          <TableColumn>Jurisdiction</TableColumn>
          <TableColumn>Created</TableColumn>
          <TableColumn />
        </TableHeader>
        <TableBody
          items={forms}
          renderEmptyState={() => (
            <Empty
              title="No forms"
              icon={FileText}
              button={{
                children: "New Form",
                onPress: () => setIsNewFormModalOpen(true),
              }}
            />
          )}
        >
          {forms?.map((form) => (
            <FormTableRow key={form._id} form={form} />
          ))}
        </TableBody>
      </Table>
      <NewFormModal
        isOpen={isNewFormModalOpen}
        onOpenChange={setIsNewFormModalOpen}
        onSubmit={() => setIsNewFormModalOpen(false)}
      />
    </div>
  );
}
