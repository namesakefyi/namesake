import { Banner, Button, Form, Select, SelectItem } from "@/components/common";
import { SettingsItem } from "@/components/settings";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { JURISDICTIONS, type Jurisdiction } from "@convex/constants";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type EditResidenceSettingProps = {
  user: Doc<"users">;
};

export const EditResidenceSetting = ({ user }: EditResidenceSettingProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [residence, setResidence] = useState<Jurisdiction | undefined>(
    user.residence as Jurisdiction,
  );
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateResidence = useMutation(api.users.setResidence);

  useEffect(() => {
    if (residence !== user.residence) {
      setIsEditing(true);
    }
  }, [residence, user.residence]);

  const handleCancel = () => {
    setResidence(user.residence as Jurisdiction);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    // This shouldn't be possible, but just in case
    if (!residence) {
      setError("Please select a state.");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateResidence({ residence });
      toast.success("Residence updated.");
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update residence. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SettingsItem
      label="Residence"
      description="Where do you live? This helps select the forms for your court order and state ID."
    >
      <Form onSubmit={handleSubmit} className="gap-2 items-end">
        <Select
          aria-label="State"
          name="residence"
          selectedKey={residence}
          onSelectionChange={(key) => {
            setResidence(key as Jurisdiction);
            setError(undefined);
          }}
          isRequired
          placeholder="Select state"
          isDisabled={isSubmitting}
        >
          {Object.entries(JURISDICTIONS).map(([value, label]) => (
            <SelectItem key={value} id={value}>
              {label}
            </SelectItem>
          ))}
        </Select>
        {isEditing && (
          <div className="flex gap-1 justify-end">
            <Button
              variant="secondary"
              onPress={handleCancel}
              isDisabled={isSubmitting}
              size="small"
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
        )}
        {error && <Banner variant="danger">{error}</Banner>}
      </Form>
    </SettingsItem>
  );
};
