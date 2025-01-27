import {
  Button,
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

type QuestUrlProps = {
  quest: Doc<"quests">;
  url: string;
  editable?: boolean;
  onSave: (url: string) => void;
};

const QuestUrl = ({ quest, url, editable, onSave }: QuestUrlProps) => {
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
    onSave(text);
    setIsEditing(false);
  };

  return (
    <div key={url} className="flex gap-1 items-center justify-between">
      {isEditing ? (
        <div className="flex gap-1 items-end">
          <TextField value={text} onChange={setText} type="url" label="URL" />
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

type QuestUrlsProps = {
  quest: Doc<"quests">;
  editable?: boolean;
};

export const QuestUrls = ({ quest, editable = false }: QuestUrlsProps) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const updateUrls = useMutation(api.quests.setUrls);

  const handleSave = (oldUrl: string, newUrl: string) => {
    try {
      const updatedUrls = oldUrl
        ? quest.urls?.map((u) => (u === oldUrl ? newUrl : u))
        : [...(quest.urls || []), newUrl];

      updateUrls({ questId: quest._id, urls: updatedUrls });
      setIsAddingNew(false);
      setNewUrl("");
    } catch (error) {
      toast.error("Couldn't update URL");
    }
  };

  return (
    <div className="flex flex-col items-start gap-1 mb-4">
      {quest.urls?.map((url) => (
        <QuestUrl
          key={url}
          quest={quest}
          url={url}
          editable={editable}
          onSave={(newUrl) => handleSave(url, newUrl)}
        />
      ))}
      {editable &&
        (isAddingNew ? (
          <div className="flex gap-1 items-end">
            <TextField
              value={newUrl}
              onChange={setNewUrl}
              type="url"
              label="URL"
              className="flex-1"
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
        ) : (
          <Button
            type="button"
            variant="secondary"
            onPress={() => setIsAddingNew(true)}
          >
            Add URL
          </Button>
        ))}
    </div>
  );
};
