import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { useState } from "react";
import { toast } from "sonner";
import {
  Banner,
  Button,
  DialogTrigger,
  Form,
  Popover,
  TextField,
} from "@/components/common";
import { SettingsItem } from "@/components/settings";

type EditNameSettingProps = {
  user: Doc<"users">;
};

export const EditNameSetting = ({ user }: EditNameSettingProps) => {
  const updateName = useMutation(api.users.setName);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name ?? "");
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    setIsEditing(false);
    setName(user.name ?? "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    try {
      setIsSubmitting(true);
      await updateName({ name });
      toast.success("Name updated.");
      setIsEditing(false);
    } catch (err) {
      setError(
        err instanceof ConvexError
          ? err.message
          : "Failed to update name. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SettingsItem
      label="Display name"
      description="How should Namesake refer to you? This can be different from your legal name."
    >
      <DialogTrigger>
        <Button onPress={() => setIsEditing(true)}>
          <span className="truncate max-w-[24ch]">
            {user?.name ?? "Set name"}
          </span>
        </Button>
        <Popover className="p-2" placement="bottom end" isOpen={isEditing}>
          <Form onSubmit={handleSubmit} className="gap-2">
            <TextField
              aria-label="Name"
              name="name"
              value={name}
              onChange={(value) => {
                setName(value);
                setError(undefined);
              }}
              className="w-full"
              isRequired
              autoFocus
            />
            <div className="flex gap-1 justify-end">
              <Button
                size="small"
                isDisabled={isSubmitting}
                onPress={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isSubmitting={isSubmitting}
                size="small"
              >
                Save
              </Button>
            </div>
            {error && <Banner variant="danger">{error}</Banner>}
          </Form>
        </Popover>
      </DialogTrigger>
    </SettingsItem>
  );
};
