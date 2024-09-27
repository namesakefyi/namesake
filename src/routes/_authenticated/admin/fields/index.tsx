import {
  Button,
  Empty,
  Form,
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
import { api } from "@convex/_generated/api";
import type { DataModel } from "@convex/_generated/dataModel";
import { FIELDS, type Field } from "@convex/constants";
import { RiAddLine, RiInputField } from "@remixicon/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/fields/")({
  component: FieldsRoute,
});

const NewFieldModal = ({
  isOpen,
  onOpenChange,
  onSubmit,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
}) => {
  const createField = useMutation(api.questFields.createField);
  const [label, setLabel] = useState("");
  const [slug, setSlug] = useState("");
  const [helpText, setHelpText] = useState("");
  const [type, setType] = useState<Field>("text");

  useEffect(() => {
    const toCamelCase = function camalize(str: string) {
      return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    };

    setSlug(toCamelCase(label));
  }, [label]);

  const clearForm = () => {
    setLabel("");
    setHelpText("");
    setType("text");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createField({ label, slug, helpText, type });

    clearForm();
    onSubmit();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <h2 className="text-xl">Create new field</h2>
      <Form className="w-full" onSubmit={handleSubmit}>
        <Select
          label="Type"
          name="type"
          selectedKey={type}
          onSelectionChange={(value) => setType(value as Field)}
          placeholder="Select field type"
          isRequired
        >
          {Object.keys(FIELDS).map((key) => {
            const Icon = FIELDS[key].icon;
            return (
              <SelectItem key={key} id={key} textValue={key}>
                <Icon size={20} /> {key}
              </SelectItem>
            );
          })}
        </Select>
        <TextField
          label="Label"
          name="label"
          isRequired
          value={label}
          onChange={(value) => setLabel(value)}
        />
        <TextField label="Slug" name="slug" value={slug} isDisabled />
        <TextField
          label="Help text"
          name="helptext"
          value={helpText}
          onChange={(value) => setHelpText(value)}
        />
        <div className="flex gap-2 justify-end">
          <Button type="button" onPress={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Field
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

const FieldsTableRow = ({
  field,
}: {
  field: DataModel["questFields"]["document"];
}) => {
  const Icon = FIELDS[field.type].icon;

  return (
    <TableRow key={field._id} className="flex gap-2 items-center">
      <TableCell>
        <div className="flex items-center gap-2">
          <Icon className="text-gray-dim" />
          <div>{field.label}</div>
        </div>
      </TableCell>
    </TableRow>
  );
};

function FieldsRoute() {
  const [isNewFieldModalOpen, setIsNewFieldModalOpen] = useState(false);
  const fields = useQuery(api.questFields.getAllFields);

  return (
    <div>
      <PageHeader title="Fields">
        <Button onPress={() => setIsNewFieldModalOpen(true)} variant="primary">
          <RiAddLine />
          New Field
        </Button>
      </PageHeader>
      <Table aria-label="Fields">
        <TableHeader>
          <TableColumn isRowHeader>Field</TableColumn>
        </TableHeader>
        <TableBody
          items={fields}
          renderEmptyState={() => (
            <Empty
              title="No fields"
              icon={RiInputField}
              button={{
                children: "New Field",
                onPress: () => setIsNewFieldModalOpen(true),
              }}
            />
          )}
        >
          {fields?.map((field) => (
            <FieldsTableRow key={field._id} field={field} />
          ))}
        </TableBody>
      </Table>
      <NewFieldModal
        isOpen={isNewFieldModalOpen}
        onOpenChange={setIsNewFieldModalOpen}
        onSubmit={() => setIsNewFieldModalOpen(false)}
      />
    </div>
  );
}
