import {
  Badge,
  Button,
  Empty,
  FileTrigger,
  Form,
  Menu,
  MenuItem,
  MenuTrigger,
  Modal,
  PageHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  TextField,
} from "@/components";
import { RiAddLine, RiFileTextLine, RiMoreFill } from "@remixicon/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { DataModel } from "../../../../convex/_generated/dataModel";
import { JURISDICTIONS } from "../../../../convex/constants";

export const Route = createFileRoute("/admin/forms/")({
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
  const uploadPDF = useMutation(api.forms.uploadPDF);
  const createForm = useMutation(api.forms.createForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [formCode, setFormCode] = useState("");
  const [jurisdiction, setJurisdiction] = useState<JURISDICTIONS | null>(null);

  const clearForm = () => {
    setFile(null);
    setTitle("");
    setFormCode("");
    setJurisdiction(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (jurisdiction === null) throw new Error("Jurisdiction is required");
    if (file === null) throw new Error("File is required");

    setIsSubmitting(true);
    const formId = await createForm({ title, jurisdiction, formCode });

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
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <h2 className="text-xl">Upload new form</h2>
      <Form className="w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <FileTrigger
            acceptedFileTypes={["application/pdf"]}
            onSelect={(e) => {
              if (e === null) return;
              const files = Array.from(e);
              setFile(files[0]);
            }}
          >
            <Button variant="secondary">Select a PDF</Button>
          </FileTrigger>
          {file && <p>{file.name}</p>}
        </div>
        <TextField
          label="Title"
          name="title"
          isRequired
          value={title}
          onChange={(value) => setTitle(value)}
          description="Use title case."
        />
        <TextField
          label="Form Code"
          name="formCode"
          value={formCode}
          onChange={(value) => setFormCode(value)}
          description="Legal reference codes like “CJP 27”. Optional."
        />
        <Select
          label="Jurisdiction"
          name="jurisdiction"
          selectedKey={jurisdiction}
          onSelectionChange={(key) => setJurisdiction(key as JURISDICTIONS)}
          placeholder="Select a jurisdiction"
          isRequired
        >
          {Object.entries(JURISDICTIONS).map(([value, label]) => (
            <SelectItem key={value} id={value}>
              {label}
            </SelectItem>
          ))}
        </Select>

        <div className="flex gap-2 justify-end">
          <Button type="button" onPress={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" isDisabled={isSubmitting} variant="primary">
            Upload Form
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

const FormTableRow = ({ form }: { form: DataModel["forms"]["document"] }) => {
  const formUrl = useQuery(api.forms.getFormPDFUrl, { formId: form._id });
  const deleteForm = useMutation(api.forms.deleteForm);
  const undeleteForm = useMutation(api.forms.undeleteForm);
  const permanentlyDeleteForm = useMutation(api.forms.permanentlyDeleteForm);

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
          <Button variant="icon" aria-label="Actions">
            <RiMoreFill size={16} />
          </Button>
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
                  onAction={() => permanentlyDeleteForm({ formId: form._id })}
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
  const forms = useQuery(api.forms.getAllForms);

  return (
    <div>
      <PageHeader title="Forms">
        <Button onPress={() => setIsNewFormModalOpen(true)} variant="primary">
          <RiAddLine />
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
              icon={RiFileTextLine}
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
