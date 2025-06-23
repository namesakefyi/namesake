import type { Id } from "@convex/_generated/dataModel";
import { AlertTriangle, FileLock2 } from "lucide-react";
import { useState } from "react";
import { type Selection, Text } from "react-aria-components";
import {
  Badge,
  Button,
  Empty,
  ListBox,
  ListBoxItem,
} from "@/components/common";
import { DeleteFormResponseModal } from "@/components/settings";
import { ALL, FIELD_DEFS, type FieldName } from "@/constants";
import { useDecrypt } from "@/hooks/useDecrypt";

/**
 * Get the readable field label for a given field.
 * If the field is not in the USER_FORM_DATA_FIELDS object, return the field as-is.
 * @param field - The field to get the readable label for.
 * @returns The readable label for the field.
 */
export const getReadableFieldLabel = (field: FieldName) => {
  return FIELD_DEFS.find((f) => f.name === field)?.label ?? field;
};

interface FormResponseItemProps {
  initialData: { id: Id<"userFormResponses">; field: string; value: string };
}

export function FormResponseItem({
  initialData: { id, field, value },
}: FormResponseItemProps) {
  const { decryptedValue, error } = useDecrypt(value);

  return (
    <ListBoxItem
      id={id}
      textValue={field}
      className="flex flex-col gap-1 items-start"
    >
      <Text slot="label">{field}</Text>
      {decryptedValue && (
        <Text slot="description">
          {error ? (
            <Badge icon={AlertTriangle}>Error</Badge>
          ) : (
            <span className="opacity-70 font-mono text-sm">
              {decryptedValue.toString()}
            </span>
          )}
        </Text>
      )}
    </ListBoxItem>
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
    <div className="flex flex-col pb-8">
      {shouldShowControls && (
        <div className="flex gap-2 pb-4 items-center justify-between bg-app sticky sticky-top-header z-10">
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
    </div>
  );
}
