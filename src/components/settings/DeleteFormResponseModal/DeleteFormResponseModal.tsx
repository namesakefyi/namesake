import {
  Banner,
  Button,
  Modal,
  ModalFooter,
  ModalHeader,
} from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import posthog from "posthog-js";
import { useState } from "react";
import type { Selection } from "react-aria-components";
import { toast } from "sonner";
import { getDeleteLabel } from "../FormResponsesList/FormResponsesList";

interface DeleteFormResponseModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDelete: () => void;
  selectedRows: Selection;
  rows?: { id: Id<"userFormResponses">; field: string; value: string }[];
}

export function DeleteFormResponseModal({
  isOpen,
  onOpenChange,
  onDelete,
  selectedRows,
  rows,
}: DeleteFormResponseModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAll = useMutation(api.userFormResponses.deleteAll);
  const deleteByIds = useMutation(api.userFormResponses.deleteByIds);

  const deleteLabel = getDeleteLabel({
    selectedRows,
    totalCount: rows?.length ?? 0,
  });

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      if (selectedRows === "all") {
        await deleteAll();
      } else {
        await deleteByIds({
          userFormResponseIds: Array.from(
            selectedRows,
          ) as Id<"userFormResponses">[],
        });
      }

      onOpenChange(false);
      onDelete();
      toast.success("Data deleted");
    } catch (error: any) {
      setError(error.message);
      posthog.captureException(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalHeader title={`${deleteLabel}?`} />
      {error && <Banner variant="danger">{error}</Banner>}
      {selectedRows !== "all" && (
        <>
          <p>The following data will be deleted:</p>
          <ul className="list-disc list-inside text-sm leading-6 text-gray-dim">
            {Array.from(selectedRows).map((row) => (
              <li key={row}>{rows?.find((r) => r.id === row)?.field}</li>
            ))}
          </ul>
        </>
      )}
      <Banner variant="warning">This action cannot be undone.</Banner>
      <ModalFooter>
        <Button
          variant="secondary"
          onPress={() => onOpenChange(false)}
          isDisabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onPress={handleDelete}
          isDisabled={isDeleting}
        >
          {isDeleting ? "Deleting…" : deleteLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
