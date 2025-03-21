import {
  Badge,
  Button,
  Empty,
  Form,
  ListBox,
  ListBoxItem,
  Select,
  SelectItem,
  TextField,
} from "@/components/common";
import { DeleteFormResponseModal } from "@/components/settings";
import {
  decryptData,
  encryptData,
  getEncryptionKey,
  useEncryptionKey,
} from "@/utils/encryption";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import {
  ALL,
  USER_FORM_DATA_FIELDS,
  type UserFormDataField,
} from "@convex/constants";
import { useMutation, useQuery } from "convex/react";
import { AlertTriangle, FileLock2 } from "lucide-react";
import posthog from "posthog-js";
import { useEffect, useState } from "react";
import { type Selection, Text } from "react-aria-components";

/**
 * Get the readable field label for a given field.
 * If the field is not in the USER_FORM_DATA_FIELDS object, return the field as-is.
 * @param field - The field to get the readable label for.
 * @returns The readable label for the field.
 */
export const getReadableFieldLabel = (field: UserFormDataField | string) => {
  return USER_FORM_DATA_FIELDS[field as UserFormDataField] ?? field;
};

interface FormResponseItemProps {
  initialData: { id: Id<"userFormResponses">; field: string; value: string };
}

export function FormResponseItem({ initialData }: FormResponseItemProps) {
  const [decryptedValue, setDecryptedValue] = useState<string>();
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
  const [didError, setDidError] = useState(false);

  useEffect(() => {
    const loadEncryptionKey = async () => {
      try {
        const key = await getEncryptionKey();
        setEncryptionKey(key);

        if (!key) {
          return;
        }

        if (initialData.value) {
          try {
            const decryptedValue = await decryptData(initialData.value, key);
            setDecryptedValue(decryptedValue);
          } catch (error: any) {
            posthog.captureException(error);
            setDidError(true);
          }
        } else {
          setDecryptedValue("");
        }
      } catch (error: any) {
        posthog.captureException(error);
        setDidError(true);
      }
    };

    loadEncryptionKey();
  }, [initialData.value]);

  return (
    <ListBoxItem
      id={initialData.id}
      textValue={initialData.field}
      className="flex flex-col gap-1 items-start"
    >
      <Text slot="label">{initialData.field}</Text>
      {encryptionKey && (
        <Text slot="description">
          {didError ? (
            <Badge variant="danger" icon={AlertTriangle}>
              Error
            </Badge>
          ) : (
            <span className="opacity-70 font-mono text-sm">
              {decryptedValue}
            </span>
          )}
        </Text>
      )}
    </ListBoxItem>
  );
}

// This is only used for testing, and as an example of submitting encrypted data.
// TODO: Remove when actual form data is being saved and encrypted.
function AddFormResponse() {
  const [field, setField] = useState<UserFormDataField | null>(null);
  const [value, setValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const encryptionKey = useEncryptionKey();

  const save = useMutation(api.userFormResponses.set);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!encryptionKey) {
      console.error("No encryption key available");
      return;
    }

    if (!field) {
      console.error("No field selected");
      return;
    }

    try {
      setIsSaving(true);

      // Encrypt the value before saving
      const encryptedValue = await encryptData(value, encryptionKey);
      await save({ field, value: encryptedValue });
      setField(null);
      setValue("");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="border border-gray-dim rounded-lg p-4 flex-row gap-2 items-end"
    >
      <Select
        label="Question"
        name="field"
        className="flex-1"
        items={Object.entries(USER_FORM_DATA_FIELDS).map(([key, label]) => ({
          label,
          value: key,
        }))}
        selectedKey={field}
        onSelectionChange={(key) => setField(key as UserFormDataField)}
      >
        {(item) => (
          <SelectItem key={item.value} id={item.value}>
            {item.label}
          </SelectItem>
        )}
      </Select>
      <TextField
        label="Value"
        name="value"
        value={value}
        onChange={setValue}
        className="flex-1"
      />
      <Button
        type="submit"
        variant="secondary"
        isDisabled={!field || value === "" || isSaving}
      >
        {isSaving ? "Saving..." : "Add response"}
      </Button>
    </Form>
  );
}

interface ResponseCountLabelProps {
  selectedRows: Selection;
  totalCount: number;
}

export function getResponseCountLabel({
  selectedRows,
  totalCount,
}: ResponseCountLabelProps) {
  const hasSelectedAll =
    selectedRows === ALL || selectedRows.size === totalCount;

  return `${
    hasSelectedAll
      ? "all responses"
      : `${selectedRows.size} ${selectedRows.size === 1 ? "response" : "responses"}`
  }`;
}

interface FormResponse {
  id: Id<"userFormResponses">;
  field: string;
  value: string;
}

interface FormResponsesListProps {
  rows?: FormResponse[];
}

export function FormResponsesList({ rows }: FormResponsesListProps) {
  const [selectedRows, setSelectedRows] = useState<Selection>(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const userRole = useQuery(api.users.getCurrentRole);

  const hasSelectedAll =
    selectedRows === ALL || selectedRows.size === rows?.length;
  const hasSelectedRows = selectedRows === ALL || selectedRows.size > 0;
  const deleteLabel = `Delete ${getResponseCountLabel({
    selectedRows,
    totalCount: rows?.length ?? 0,
  })}`;

  const shouldShowControls = rows && rows.length > 0;

  const handleSelectAll = () =>
    hasSelectedAll ? setSelectedRows(new Set()) : setSelectedRows(ALL);

  return (
    <div className="flex flex-col gap-4">
      {shouldShowControls && (
        <div className="flex gap-2 items-center justify-between">
          <Button variant="secondary" size="small" onPress={handleSelectAll}>
            {hasSelectedAll ? "Deselect all" : "Select all"}
          </Button>
          <Button
            variant={hasSelectedRows ? "destructive" : "secondary"}
            size="small"
            isDisabled={!hasSelectedRows}
            onPress={() => setIsDeleteModalOpen(true)}
          >
            {hasSelectedRows ? deleteLabel : "Delete"}
          </Button>
        </div>
      )}
      <ListBox
        selectionMode="multiple"
        aria-label="All encrypted form responses"
        selectedKeys={selectedRows}
        onSelectionChange={setSelectedRows}
        items={rows}
        renderEmptyState={() => (
          <Empty
            title="No data"
            subtitle="Form responses will appear here."
            icon={FileLock2}
          />
        )}
      >
        {(item) => <FormResponseItem key={item.id} initialData={item} />}
      </ListBox>
      <DeleteFormResponseModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onDelete={() => {
          setSelectedRows(new Set());
        }}
        selectedRows={selectedRows}
        rows={rows}
      />
      {userRole === "admin" && <AddFormResponse />}
    </div>
  );
}
