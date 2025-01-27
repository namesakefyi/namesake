import { Button, Select, SelectItem, TextField } from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import {
  CATEGORIES,
  type Category,
  JURISDICTIONS,
  type Jurisdiction,
} from "@convex/constants";
import { useMutation } from "convex/react";
import { CircleHelp } from "lucide-react";
import type { Key } from "react";
import { useState } from "react";
import { toast } from "sonner";

type QuestBasicsProps = {
  quest: Doc<"quests">;
  editable?: boolean;
};

export const QuestBasics = ({ quest, editable = false }: QuestBasicsProps) => {
  const [title, setTitle] = useState(quest.title);
  const updateCategory = useMutation(api.quests.setCategory);
  const updateJurisdiction = useMutation(api.quests.setJurisdiction);
  const updateTitle = useMutation(api.quests.setTitle);

  const handleTitleChange = () => {
    updateTitle({ questId: quest._id, title });
  };

  const handleJurisdictionChange = (jurisdiction: Key) => {
    if (jurisdiction !== undefined) {
      try {
        updateJurisdiction({
          questId: quest._id,
          jurisdiction: jurisdiction as Jurisdiction,
        });
      } catch (error) {
        toast.error("Couldn't update state.");
      }
    }
  };

  const handleCategoryChange = (category: Key) => {
    if (category !== undefined) {
      try {
        updateCategory({ questId: quest._id, category: category as Category });
      } catch (error) {
        toast.error("Couldn't update category.");
      }
    }
  };

  if (!editable) return null;

  return (
    <div className="flex items-start gap-4">
      <div className="flex gap-2 flex-1 items-end">
        <TextField
          label="Title"
          value={title}
          onChange={setTitle}
          className="flex-1"
        />
        <Button onPress={handleTitleChange} isDisabled={title === quest.title}>
          Save
        </Button>
      </div>
      <Select
        label="State"
        name="jurisdiction"
        selectedKey={quest.jurisdiction}
        onSelectionChange={handleJurisdictionChange}
        placeholder="Select a state"
        className="flex-[0.5]"
      >
        {Object.entries(JURISDICTIONS).map(([value, label]) => (
          <SelectItem key={value} id={value}>
            {label}
          </SelectItem>
        ))}
      </Select>
      <Select
        label="Category"
        name="category"
        selectedKey={quest.category}
        onSelectionChange={handleCategoryChange}
        placeholder="Select a category"
        className="flex-[0.5]"
      >
        {Object.entries(CATEGORIES).map(([key, { label, icon }]) => {
          const Icon = icon ?? CircleHelp;
          return (
            <SelectItem key={key} id={key} textValue={key}>
              <Icon size={20} /> {label}
            </SelectItem>
          );
        })}
      </Select>
    </div>
  );
};
