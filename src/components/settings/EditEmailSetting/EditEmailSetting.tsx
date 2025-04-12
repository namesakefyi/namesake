import {
  Banner,
  Button,
  DialogTrigger,
  Form,
  Popover,
  TextField,
} from "@/components/common";
import { SettingsItem } from "@/components/settings";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { DUPLICATE_EMAIL, INVALID_EMAIL } from "@convex/errors";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { useState } from "react";
import { toast } from "sonner";

type EditEmailSettingProps = {
  user: Doc<"users">;
};

export const EditEmailSetting = ({ user }: EditEmailSettingProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const updateEmail = useMutation(api.users.setEmail);
  const [email, setEmail] = useState(user.email ?? "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);
      await updateEmail({ email: email.trim() });
      toast.success("Email updated.");
      setIsEditing(false);
    } catch (err) {
      if (err instanceof ConvexError) {
        if (err.data === INVALID_EMAIL) {
          setError("Please enter a valid email address.");
        } else if (err.data === DUPLICATE_EMAIL) {
          setError("This email is currently in use. Try another one.");
        } else {
          setError("Something went wrong. Please try again later.");
        }
      } else {
        setError("Failed to update email. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SettingsItem label="Email">
      <DialogTrigger>
        <Button onPress={() => setIsEditing(true)}>
          <span className="truncate max-w-[24ch]">
            {user?.email ?? "Set email"}
          </span>
        </Button>
        <Popover className="p-2" placement="bottom end" isOpen={isEditing}>
          <Form onSubmit={handleSubmit} className="gap-2">
            <TextField
              aria-label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(value) => setEmail(value)}
              className="w-60 max-w-full"
              isRequired
              autoFocus
            />
            <div className="flex gap-1 justify-end">
              <Button
                variant="secondary"
                isDisabled={isSubmitting}
                size="small"
                onPress={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="small"
                isDisabled={isSubmitting}
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
