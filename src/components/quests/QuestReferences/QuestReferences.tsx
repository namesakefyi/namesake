import {
  Button,
  Empty,
  Link,
  Menu,
  MenuItem,
  MenuTrigger,
  TextField,
} from "@/components/common";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Link as LinkIcon, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { QuestSection } from "../QuestSection/QuestSection";

type QuestReferenceProps = {
  quest: Doc<"quests">;
  url: string;
  editable?: boolean;
  onSave: (url: string) => void;
};

const QuestReference = ({
  quest,
  url,
  editable,
  onSave,
}: QuestReferenceProps) => {
  const [text, setText] = useState(url);
  const [isEditing, setIsEditing] = useState(false);
  const deleteUrl = useMutation(api.quests.deleteUrl);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    deleteUrl({ questId: quest._id, url });
  };

  const handleSave = () => {
    onSave(url);
    setIsEditing(false);
  };

  return (
    <div key={url} className="flex gap-1 items-center justify-between">
      {isEditing ? (
        <div className="flex gap-1 items-end w-full">
          <TextField
            value={text}
            onChange={setText}
            type="url"
            label="URL"
            className="flex-1"
          />
          <Button type="button" variant="secondary" onPress={handleSave}>
            Save
          </Button>
        </div>
      ) : (
        <Link href={url} className="inline-flex gap-1 items-center">
          <LinkIcon size={20} />
          {url}
        </Link>
      )}
      {editable && !isEditing && (
        <MenuTrigger>
          <Button
            type="button"
            variant="icon"
            size="small"
            onPress={() => {}}
            icon={MoreHorizontal}
          />
          <Menu>
            <MenuItem onAction={handleEdit}>Edit</MenuItem>
            <MenuItem onAction={handleDelete}>Delete</MenuItem>
          </Menu>
        </MenuTrigger>
      )}
    </div>
  );
};

type QuestReferencesProps = {
  quest: Doc<"quests">;
  editable?: boolean;
};

export const QuestReferences = ({
  quest,
  editable = false,
}: QuestReferencesProps) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newUrl, setNewUrl] = useState("https://");
  const updateUrls = useMutation(api.quests.setUrls);

  const handleSave = (oldUrl: string, newUrl: string) => {
    try {
      const updatedUrls = oldUrl
        ? quest.urls?.map((u) => (u === oldUrl ? newUrl : u))
        : [...(quest.urls || []), newUrl];

      updateUrls({ questId: quest._id, urls: updatedUrls });
      setIsAddingNew(false);
      setNewUrl("https://");
    } catch (error) {
      toast.error("Couldn't update URL");
    }
  };

  if (!editable && !quest.urls) return null;

  return (
    <QuestSection
      title="References"
      action={
        editable
          ? {
              children: "Add reference",
              onPress: () => setIsAddingNew(true),
            }
          : undefined
      }
    >
      {editable && isAddingNew && (
        <div className="flex gap-1 items-end w-full mb-4">
          <TextField
            value={newUrl}
            onChange={setNewUrl}
            type="url"
            aria-label="URL"
            className="flex-1"
            autoFocus
          />
          <Button
            type="button"
            variant="secondary"
            onPress={() => setIsAddingNew(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            onPress={() => handleSave("", newUrl)}
          >
            Save
          </Button>
        </div>
      )}
      {!quest.urls ? (
        <Empty title="No references" icon={LinkIcon} />
      ) : (
        <div className="flex flex-col gap-1">
          {quest.urls?.map((url) => (
            <QuestReference
              key={url}
              quest={quest}
              url={url}
              editable={editable}
              onSave={(newUrl) => handleSave(url, newUrl)}
            />
          ))}
        </div>
      )}
    </QuestSection>
  );
};
