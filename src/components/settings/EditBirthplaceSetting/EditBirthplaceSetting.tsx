import { Banner, Button, Form, Select, SelectItem } from "@/components/common";
import { SettingsItem } from "@/components/settings";
import { BIRTHPLACES, type Birthplace } from "@/constants";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (birthplace !== user.birthplace) {
      setIsEditing(true);
    }
  }, [birthplace, user.birthplace]);

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
      <Form onSubmit={handleSubmit} className="gap-2 items-end">
        <Select
          aria-label="State"
          name="birthplace"
          selectedKey={birthplace}
          onSelectionChange={(key) => {
            setBirthplace(key as Birthplace);
            setError(undefined);
          }}
          isRequired
          placeholder="Select state"
          isDisabled={isSubmitting}
        >
          {Object.entries(BIRTHPLACES).map(([value, label]) => (
            <SelectItem key={value} id={value}>
              {label}
            </SelectItem>
          ))}
        </Select>
        {isEditing && (
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
              isSubmitting={isSubmitting}
              size="small"
            >
              Save
            </Button>
          </div>
        )}
        {error && <Banner variant="danger">{error}</Banner>}
      </Form>
    </SettingsItem>
  );
};
