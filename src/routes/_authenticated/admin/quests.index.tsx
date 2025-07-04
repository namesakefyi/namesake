import { api } from "@convex/_generated/api";
import type { DataModel } from "@convex/_generated/dataModel";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { CircleHelp, Ellipsis, Milestone, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app";
import {
  Badge,
  Button,
  Empty,
  Form,
  FormattedDate,
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
import {
  CATEGORIES,
  type Category,
  JURISDICTIONS,
  type Jurisdiction,
} from "@/constants";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const clearForm = () => {
    setTitle("");
    setCategory(null);
    setJurisdiction(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
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
          to: "/quests/$questSlug",
          params: { questSlug: slug },
        });
      }
    } catch (error) {
      toast.error("Failed to create quest");
      console.error(error);
    } finally {
      setIsSubmitting(false);
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
          <Button
            type="button"
            onPress={() => onOpenChange(false)}
            isDisabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isSubmitting={isSubmitting}>
            Create Quest
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

const CategoryBadge = ({ category }: { category: Category | undefined }) => {
  if (!category) return;

  const { icon, label } = CATEGORIES[category];

  return <Badge icon={icon ?? CircleHelp}>{label}</Badge>;
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

  return (
    <TableRow
      key={quest._id}
      className="flex gap-2 items-center"
      href={{ to: "/quests/$questSlug", params: { questSlug: quest.slug } }}
    >
      <TableCell>
        <div className="flex items-center gap-2">
          <div>{quest.title}</div>
          {quest.jurisdiction && <Badge>{quest.jurisdiction}</Badge>}
          {quest.deletedAt && (
            <span className="text-red-9" slot="description">
              {`deleted ${new Date(quest.deletedAt).toLocaleString()}`}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <CategoryBadge category={quest.category as Category} />
      </TableCell>
      <TableCell>{questCount}</TableCell>
      <TableCell>
        <FormattedDate date={new Date(quest._creationTime)} />
      </TableCell>
      <TableCell>
        <FormattedDate date={new Date(quest.updatedAt)} />
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
      <PageHeader title="Quests" mobileBackLink={{ to: "/admin" }}>
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
