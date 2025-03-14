import {
  Badge,
  Banner,
  Button,
  Empty,
  Modal,
  ModalFooter,
  ModalHeader,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/common";
import {
  decryptData,
  getEncryptionKey,
  initializeEncryption,
} from "@/utils/encryption";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { AlertTriangle, Database } from "lucide-react";
import posthog from "posthog-js";
import { useEffect, useState } from "react";
import type { Selection } from "react-aria-components";
import { toast } from "sonner";

interface UserDataTableRowProps {
  initialData: { id: Id<"userFormData">; field: string; value: string };
}

// Placeholder for allowing users to view and edit their form data
// TODO: Replace this with a more robust implementation that manages draft state better.
export function UserDataTableRow({ initialData }: UserDataTableRowProps) {
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

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   if (!encryptionKey || !decryptedValue) {
  //     console.error("No encryption key or decrypted value available");
  //     return;
  //   }

  //   try {
  //     setIsSaving(true);

  //     // Encrypt the value before saving
  //     const encryptedValue = await encryptData(decryptedValue, encryptionKey);
  //     await save({ field, value: encryptedValue });
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  if (encryptionKey === null) {
    return (
      <TableRow id={initialData.id}>
        <TableCell>
          <Skeleton className="w-full h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="w-full h-4" />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow id={initialData.id}>
      <TableCell textValue={initialData.field}>{initialData.field}</TableCell>
      <TableCell>
        {didError ? (
          <Badge variant="danger" icon={AlertTriangle}>
            Error
          </Badge>
        ) : (
          decryptedValue
        )}
      </TableCell>
    </TableRow>
  );

  // return (
  //   <Form onSubmit={handleSubmit}>
  //     <div className="flex gap-2 items-end">
  //       <TextField
  //         label="Field"
  //         name="field"
  //         value={field}
  //         onChange={setField}
  //         placeholder="Enter field name"
  //         isDisabled={isExistingField}
  //       />
  //       <TextField
  //         label="Value"
  //         name="value"
  //         value={decryptedValue}
  //         onChange={setDecryptedValue}
  //         placeholder="Enter field value"
  //       />
  //       <Button
  //         type="submit"
  //         variant="secondary"
  //         className="w-fit"
  //         isDisabled={
  //           field === "" || decryptedValue === "" || isSaving || isDirty
  //         }
  //       >
  //         {isSaving ? (
  //           <>
  //             <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
  //             Saving...
  //           </>
  //         ) : (
  //           "Save"
  //         )}
  //       </Button>
  //     </div>
  //   </Form>
  // );
}

// Placeholder for allowing users to view and edit their form data
export function UserDataTable() {
  const [selectedRows, setSelectedRows] = useState<Selection>(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userData = useQuery(api.userFormData.list);
  const deleteAll = useMutation(api.userFormData.deleteAll);
  const deleteByIds = useMutation(api.userFormData.deleteByIds);

  useEffect(() => {
    const setupEncryption = async () => {
      try {
        await initializeEncryption();
      } catch (error: any) {
        posthog.captureException(error);
      }
    };

    setupEncryption();
  }, []);

  const hasSelectedRows = selectedRows === "all" || selectedRows.size > 0;
  const deleteLabel = `Delete ${
    selectedRows === "all"
      ? "all data"
      : `${selectedRows.size} ${selectedRows.size === 1 ? "item" : "items"}`
  }`;

  const columns = [
    { name: "Field", id: "field", isRowHeader: true },
    { name: "Value", id: "value" },
  ];

  const rows = userData?.map((data) => ({
    id: data._id,
    field: data.field,
    value: data.value,
  }));

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      if (selectedRows === "all") {
        await deleteAll();
      } else {
        await deleteByIds({
          userFormDataIds: Array.from(selectedRows) as Id<"userFormData">[],
        });
      }

      setIsDeleteModalOpen(false);
      setSelectedRows(new Set());
      toast.success("Data deleted");
    } catch (error: any) {
      setError(error.message);
      posthog.captureException(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex gap-2 items-center justify-end">
          <Button
            variant="destructive"
            className="w-fit mt-4"
            isDisabled={!hasSelectedRows}
            onPress={() => setIsDeleteModalOpen(true)}
          >
            {deleteLabel}
          </Button>
        </div>
        <Table
          selectionMode="multiple"
          aria-label="All encrypted user data"
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.id} isRowHeader={column.isRowHeader}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={rows}
            renderEmptyState={() => <Empty title="No data" icon={Database} />}
          >
            {(item) => <UserDataTableRow key={item.id} initialData={item} />}
          </TableBody>
        </Table>
      </div>
      <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ModalHeader title={`${deleteLabel}?`} />
        {error && <Banner variant="danger">{error}</Banner>}
        {selectedRows === "all" ? (
          <p>
            <strong>All data</strong> will be deleted.
          </p>
        ) : (
          <>
            <p>The following data will be deleted:</p>
            <ul className="list-disc list-inside text-sm leading-6 text-gray-dim">
              {Array.from(selectedRows).map((row) => (
                <li key={row}>{rows?.find((r) => r.id === row)?.field}</li>
              ))}
            </ul>
          </>
        )}
        <p>This action cannot be undone.</p>
        <ModalFooter>
          <Button
            variant="secondary"
            onPress={() => setIsDeleteModalOpen(false)}
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
    </>
  );
}
