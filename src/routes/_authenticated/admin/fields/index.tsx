import {
  Button,
  Empty,
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
import { api } from "@convex/_generated/api";
import type { DataModel, Id } from "@convex/_generated/dataModel";
import { FIELDS, type Field } from "@convex/constants";
import { RiAddLine, RiInputField, RiMoreFill } from "@remixicon/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/fields/")({
  component: FieldsRoute,
});

export const NewFieldModal = ({
  isOpen,
  onOpenChange,
  onSubmit,
  onFieldCreated,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
  onFieldCreated?: (fieldId: Id<"questFields">) => void;
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newField = await createField({ label, slug, helpText, type });

    clearForm();
    onSubmit();
    if (onFieldCreated && newField) {
      onFieldCreated(newField);
    }
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
  const undeleteField = useMutation(api.questFields.undeleteField);
  const deleteField = useMutation(api.questFields.deleteField);
  const permanentlyDeleteField = useMutation(
    api.questFields.permanentlyDeleteField,
  );
  const fieldCount = useQuery(api.questFields.getFieldUsageCount, {
    fieldId: field._id,
  });

  const Icon = FIELDS[field.type].icon;

  return (
    <TableRow key={field._id} className="flex gap-2 items-center">
      <TableCell>
        <div className="flex items-center gap-2">
          <Icon className="text-gray-dim" />
          <div>{field.label}</div>
          {field.deletionTime && (
            <span className="text-red-5" slot="description">
              {`deleted ${new Date(field.deletionTime).toLocaleString()}`}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>{field.slug}</TableCell>
      <TableCell>{fieldCount}</TableCell>
      <TableCell>
        <MenuTrigger>
          <Button
            variant="icon"
            aria-label="Actions"
            size="small"
            icon={RiMoreFill}
          />
          <Menu>
            {field.deletionTime ? (
              <>
                <MenuItem
                  onAction={() => undeleteField({ fieldId: field._id })}
                >
                  Undelete
                </MenuItem>
                {/* TODO: Add modal */}
                <MenuItem
                  onAction={() =>
                    permanentlyDeleteField({ fieldId: field._id })
                  }
                >
                  Permanently Delete
                </MenuItem>
              </>
            ) : (
              <MenuItem onAction={() => deleteField({ fieldId: field._id })}>
                Delete
              </MenuItem>
            )}
          </Menu>
        </MenuTrigger>
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
          <TableColumn>Slug</TableColumn>
          <TableColumn>Used in # quests</TableColumn>
          <TableColumn />
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
