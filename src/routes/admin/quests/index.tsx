import { RiAddLine, RiMoreFill, RiSignpostLine } from "@remixicon/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { DataModel } from "../../../../convex/_generated/dataModel";
import { JURISDICTIONS } from "../../../../convex/constants";
import {
  Badge,
  Button,
  Empty,
  Form,
  Menu,
  MenuItem,
  MenuTrigger,
  Modal,
  PageHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  TextField,
} from "../../../components";

export const Route = createFileRoute("/admin/quests/")({
  component: QuestsRoute,
});

const NewQuestModal = ({
  isOpen,
  onOpenChange,
  onSubmit,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
}) => {
  const createQuest = useMutation(api.quests.createQuest);
  const [title, setTitle] = useState("");
  const [jurisdiction, setJurisdiction] = useState<JURISDICTIONS | null>(null);

  const clearForm = () => {
    setTitle("");
    setJurisdiction(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createQuest({ title, jurisdiction: jurisdiction ?? undefined });

    clearForm();
    onSubmit();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <h2 className="text-xl">Create new quest</h2>
      <Form className="w-full" onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          isRequired
          value={title}
          onChange={(value) => setTitle(value)}
        />
        <Select
          label="Jurisdiction"
          name="jurisdiction"
          selectedKey={jurisdiction}
          onSelectionChange={(key) => setJurisdiction(key as JURISDICTIONS)}
          placeholder="Select a jurisdiction"
        >
          {Object.entries(JURISDICTIONS).map(([value, label]) => (
            <SelectItem key={value} id={value}>
              {label}
            </SelectItem>
          ))}
        </Select>
        <div className="flex gap-2 justify-end">
          <Button type="button" onPress={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Quest
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

const QuestTableRow = ({
  quest,
}: { quest: DataModel["quests"]["document"] }) => {
  const questCount = useQuery(api.usersQuests.getQuestCount, {
    questId: quest._id,
  });
  const deleteQuest = useMutation(api.quests.deleteQuest);
  const undeleteQuest = useMutation(api.quests.undeleteQuest);
  const permanentlyDeleteQuest = useMutation(api.quests.permanentlyDeleteQuest);

  return (
    <TableRow
      key={quest._id}
      className="flex gap-2 items-center"
      href={{ to: "/admin/quests/$questId", params: { questId: quest._id } }}
    >
      <TableCell>
        <div>{quest.title}</div>
        {quest.deletionTime && (
          <span className="text-red-9 dark:text-reddark-9" slot="description">
            {`deleted ${new Date(quest.deletionTime).toLocaleString()}`}
          </span>
        )}
      </TableCell>
      <TableCell>
        {quest.jurisdiction ? (
          <Badge>{quest.jurisdiction}</Badge>
        ) : (
          <span className="text-gray-dim opacity-50">—</span>
        )}
      </TableCell>
      <TableCell>{questCount}</TableCell>
      <TableCell>{new Date(quest._creationTime).toLocaleString()}</TableCell>
      <TableCell>
        <MenuTrigger>
          <Button variant="icon" aria-label="Actions">
            <RiMoreFill size={16} />
          </Button>
          <Menu>
            {quest.deletionTime ? (
              <>
                <MenuItem
                  onAction={() => undeleteQuest({ questId: quest._id })}
                >
                  Undelete
                </MenuItem>
                <MenuItem
                  onAction={() =>
                    permanentlyDeleteQuest({ questId: quest._id })
                  }
                >
                  Permanently Delete
                </MenuItem>
              </>
            ) : (
              <MenuItem onAction={() => deleteQuest({ questId: quest._id })}>
                Delete
              </MenuItem>
            )}
          </Menu>
        </MenuTrigger>
      </TableCell>
    </TableRow>
  );
};

function QuestsRoute() {
  const [isNewQuestModalOpen, setIsNewQuestModalOpen] = useState(false);
  const quests = useQuery(api.quests.getAllQuests);

  return (
    <div>
      <PageHeader title="Quests">
        <Button onPress={() => setIsNewQuestModalOpen(true)} variant="primary">
          <RiAddLine />
          New Quest
        </Button>
      </PageHeader>
      <Table aria-label="Quests">
        <TableHeader>
          <TableColumn isRowHeader>Quest</TableColumn>
          <TableColumn>Jurisdiction</TableColumn>
          <TableColumn>Used By</TableColumn>
          <TableColumn>Created</TableColumn>
          <TableColumn />
        </TableHeader>
        <TableBody
          items={quests}
          renderEmptyState={() => (
            <Empty
              title="No quests"
              icon={RiSignpostLine}
              button={{
                children: "New Quest",
                onPress: () => setIsNewQuestModalOpen(true),
              }}
            />
          )}
        >
          {quests?.map((quest) => (
            <QuestTableRow key={quest._id} quest={quest} />
          ))}
        </TableBody>
      </Table>
      <NewQuestModal
        isOpen={isNewQuestModalOpen}
        onOpenChange={setIsNewQuestModalOpen}
        onSubmit={() => setIsNewQuestModalOpen(false)}
      />
    </div>
  );
}
