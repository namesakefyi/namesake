import {
  Banner,
  Button,
  ComboBox,
  ComboBoxItem,
  DialogTrigger,
  Form,
  Popover,
} from "@/components/common";
import { SettingsItem } from "@/components/settings";
import { BIRTHPLACES, type Birthplace } from "@/constants";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

type EditBirthplaceSettingProps = {
  user: Doc<"users">;
};

export const EditBirthplaceSetting = ({ user }: EditBirthplaceSettingProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [birthplace, setBirthplace] = useState<Birthplace>(
    user.birthplace as Birthplace,
  );
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateBirthplace = useMutation(api.users.setBirthplace);

  const handleCancel = () => {
    setBirthplace(user.birthplace as Birthplace);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    if (!birthplace) {
      setError("Please select a state.");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateBirthplace({ birthplace });
      toast.success("Birthplace updated.");
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update birthplace. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SettingsItem
      label="Birthplace"
      description="Where were you born? This helps select the form for your birth certificate."
    >
      <DialogTrigger>
        <Button onPress={() => setIsEditing(true)}>
          <span className="truncate max-w-[16ch] lg:max-w-[24ch]">
            {BIRTHPLACES[user?.birthplace as Birthplace] ?? "Set birthplace"}
          </span>
        </Button>
        <Popover className="p-2" placement="bottom end" isOpen={isEditing}>
          <Form onSubmit={handleSubmit} className="gap-2 items-end">
            <ComboBox
              aria-label="State"
              name="birthplace"
              selectedKey={birthplace}
              onSelectionChange={(key) => {
                setBirthplace(key as Birthplace);
                setError(undefined);
              }}
              items={Object.entries(BIRTHPLACES).map(([value, label]) => ({
                id: value,
                label,
              }))}
              defaultInputValue={BIRTHPLACES[user?.birthplace as Birthplace]}
              autoFocus
              isRequired
              placeholder="Select state"
              isDisabled={isSubmitting}
            >
              {(item) => (
                <ComboBoxItem key={item.id} id={item.id}>
                  {item.label}
                </ComboBoxItem>
              )}
            </ComboBox>
            <div className="flex gap-1 justify-end">
              <Button
                variant="secondary"
                isDisabled={isSubmitting}
                size="small"
                onPress={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isDisabled={birthplace === user.birthplace}
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
