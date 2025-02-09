import { PageHeader } from "@/components/app";
import {
  Badge,
  Button,
  Empty,
  Form,
  Menu,
  MenuItem,
  MenuTrigger,
  Modal,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  TextField,
} from "@/components/common";
import { api } from "@convex/_generated/api";
import type { DataModel } from "@convex/_generated/dataModel";
import {
  CATEGORIES,
  type Category,
  JURISDICTIONS,
  type Jurisdiction,
} from "@convex/constants";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { CircleHelp, Ellipsis, Milestone, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/quests/")({
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
  const create = useMutation(api.quests.create);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction | null>(null);
  const navigate = useNavigate();

  const clearForm = () => {
    setTitle("");
    setCategory(null);
    setJurisdiction(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { questId, slug } = await create({
      title,
      category: category ?? undefined,
      jurisdiction: jurisdiction ?? undefined,
    });

    if (questId) {
      toast(`Created quest: ${title}`);
      clearForm();
      onSubmit();
      navigate({
        to: "/$questSlug",
        params: { questSlug: slug },
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalHeader title="New quest" />
      <Form className="w-full" onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          isRequired
          value={title}
          onChange={(value) => setTitle(value)}
          className="w-full"
        />
        <Select
          label="Category"
          name="category"
          selectedKey={category}
          onSelectionChange={(value) => setCategory(value as Category)}
          placeholder="Select a category"
          isRequired
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
        <Select
          label="State"
          name="jurisdiction"
          selectedKey={jurisdiction}
          onSelectionChange={(key) => setJurisdiction(key as Jurisdiction)}
          placeholder="Select a state"
        >
          {Object.entries(JURISDICTIONS).map(([value, label]) => (
            <SelectItem key={value} id={value}>
              {label}
            </SelectItem>
          ))}
        </Select>
        <ModalFooter>
          <Button type="button" onPress={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Quest
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

const QuestTableRow = ({
  quest,
}: {
  quest: DataModel["quests"]["document"];
}) => {
  const questCount = useQuery(api.userQuests.countGlobalUsage, {
    questId: quest._id,
  });
  const softDelete = useMutation(api.quests.softDelete);
  const undelete = useMutation(api.quests.undoSoftDelete);
  const deleteForever = useMutation(api.quests.deleteForever);

  const Category = () => {
    if (!quest.category) return;

    const { icon, label } = CATEGORIES[quest.category as Category];

    return <Badge icon={icon ?? CircleHelp}>{label}</Badge>;
  };

  return (
    <TableRow
      key={quest._id}
      className="flex gap-2 items-center"
      href={{ to: "/$questSlug", params: { questSlug: quest.slug } }}
    >
      <TableCell>
        <div className="flex items-center gap-2">
          <div>{quest.title}</div>
          {quest.jurisdiction && <Badge>{quest.jurisdiction}</Badge>}
          {quest.deletedAt && (
            <span className="text-red-9 dark:text-reddark-9" slot="description">
              {`deleted ${new Date(quest.deletedAt).toLocaleString()}`}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Category />
      </TableCell>
      <TableCell>{questCount}</TableCell>
      <TableCell>
        {new Date(quest._creationTime).toLocaleDateString()}
      </TableCell>
      <TableCell>
        {quest.updatedAt
          ? new Date(quest.updatedAt).toLocaleDateString()
          : "Never"}
      </TableCell>
      <TableCell>
        <MenuTrigger>
          <Button
            variant="icon"
            aria-label="Actions"
            size="small"
            icon={Ellipsis}
          />
          <Menu>
            {quest.deletedAt ? (
              <>
                <MenuItem onAction={() => undelete({ questId: quest._id })}>
                  Undelete
                </MenuItem>
                <MenuItem
                  onAction={() => deleteForever({ questId: quest._id })}
                >
                  Permanently Delete
                </MenuItem>
              </>
            ) : (
              <MenuItem onAction={() => softDelete({ questId: quest._id })}>
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
  const quests = useQuery(api.quests.getAll);

  return (
    <>
      <PageHeader title="Quests">
        <Button
          onPress={() => setIsNewQuestModalOpen(true)}
          icon={Plus}
          variant="primary"
        >
          New Quest
        </Button>
      </PageHeader>
      <Table aria-label="Quests">
        <TableHeader>
          <TableColumn isRowHeader>Quest</TableColumn>
          <TableColumn>Category</TableColumn>
          <TableColumn>Used By</TableColumn>
          <TableColumn>Created</TableColumn>
          <TableColumn>Updated</TableColumn>
          <TableColumn />
        </TableHeader>
        <TableBody
          items={quests}
          renderEmptyState={() => (
            <Empty
              title="No quests"
              icon={Milestone}
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
    </>
  );
}
