import {
  Badge,
  Banner,
  Button,
  Empty,
  Form,
  ListBox,
  ListBoxItem,
  Modal,
  ModalFooter,
  ModalHeader,
  TextField,
} from "@/components/common";
import {
  decryptData,
  encryptData,
  getEncryptionKey,
  initializeEncryption,
} from "@/utils/encryption";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { AlertTriangle, Database, LoaderCircle } from "lucide-react";
import posthog from "posthog-js";
import { useEffect, useState } from "react";
import { type Selection, Text } from "react-aria-components";
import { toast } from "sonner";

interface UserDataItemProps {
  initialData: { id: Id<"userFormData">; field: string; value: string };
}

export function UserDataItem({ initialData }: UserDataItemProps) {
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

function UserDataForm() {
  const [field, setField] = useState("");
  const [value, setValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);

  const save = useMutation(api.userFormData.set);

  useEffect(() => {
    const loadEncryptionKey = async () => {
      try {
        const key = await getEncryptionKey();
        setEncryptionKey(key);

        if (!key) {
          return;
        }
      } catch (error: any) {
        posthog.captureException(error);
      }
    };

    loadEncryptionKey();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!encryptionKey) {
      console.error("No encryption key available");
      return;
    }

    try {
      setIsSaving(true);

      // Encrypt the value before saving
      const encryptedValue = await encryptData(value, encryptionKey);
      await save({ field, value: encryptedValue });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="flex gap-2 items-end">
        <TextField
          label="Field"
          name="field"
          value={field}
          onChange={setField}
        />
        <TextField
          label="Value"
          name="value"
          value={value}
          onChange={setValue}
        />
        <Button
          type="submit"
          variant="secondary"
          className="w-fit"
          isDisabled={field === "" || value === "" || isSaving}
        >
          {isSaving ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </Form>
  );
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

  if (!rows || rows.length === 0) {
    return (
      <>
        <Empty
          title="No data"
          subtitle="Form responses will appear here."
          icon={Database}
        />
        <UserDataForm />
      </>
    );
  }

  return (
    <>
      <div className="mt-4 flex flex-col gap-4">
        <ListBox
          selectionMode="multiple"
          aria-label="All encrypted user data"
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
          items={rows}
        >
          {(item) => <UserDataItem key={item.id} initialData={item} />}
        </ListBox>
        {hasSelectedRows && (
          <div className="flex gap-2 items-center justify-end">
            <Button
              variant={hasSelectedRows ? "destructive" : "secondary"}
              className="w-fit"
              isDisabled={!hasSelectedRows}
              onPress={() => setIsDeleteModalOpen(true)}
            >
              {deleteLabel}
            </Button>
          </div>
        )}
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
      <UserDataForm />
    </>
  );
}
