import {
  Badge,
  Button,
  Card,
  Container,
  Menu,
  MenuItem,
  MenuTrigger,
  PageHeader,
  SearchField,
} from "@/components";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { CATEGORIES, type Category } from "@convex/constants";
import { RiArrowDropDownLine } from "@remixicon/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/browse/")({
  component: IndexRoute,
});

const QuestCard = ({
  quest,
  userQuest,
  questCount,
}: {
  quest: Doc<"quests">;
  userQuest: Doc<"userQuests"> | null | undefined;
  questCount: number | undefined;
}) => {
  const addQuest = useMutation(api.userQuests.create);
  const removeQuest = useMutation(api.userQuests.removeQuest);

  const handleAddQuest = () => {
    addQuest({ questId: quest._id }).then(() => {
      toast.success(`Added ${quest.title} quest`);
    });
  };

  const handleRemoveQuest = () => {
    removeQuest({ questId: quest._id }).then(() => {
      toast.success(`Removed ${quest.title} quest`);
    });
  };

  const CallToAction = () => {
    if (userQuest === undefined) return null;

    if (userQuest === null) {
      return (
        <Button variant="primary" onPress={handleAddQuest}>
          Add quest
        </Button>
      );
    }

    return (
      <MenuTrigger>
        <Button>
          Added
          <RiArrowDropDownLine size={20} className="-mr-1 text-gray-dim" />
        </Button>
        <Menu placement="bottom end">
          <MenuItem
            href={{ to: "/quests/$questId", params: { questId: quest._id } }}
          >
            Go to quest
          </MenuItem>
          <MenuItem onAction={handleRemoveQuest}>Remove quest</MenuItem>
        </Menu>
      </MenuTrigger>
    );
  };

  return (
    <Card className="flex items-center justify-between h-24">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {quest.title}
          {quest.jurisdiction && <Badge>{quest.jurisdiction}</Badge>}
        </div>
        <p className="text-gray-dim">{`${questCount ?? 0} user${questCount === 1 ? "" : "s"}`}</p>
      </div>
      <CallToAction />
    </Card>
  );
};

const QuestCategoryRow = ({ category }: { category: Category }) => {
  const quests = useQuery(api.quests.getAllQuestsInCategory, {
    category: category,
  });

  const { label, icon } = CATEGORIES[category];
  const Icon = icon;

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-gray-dim font-semibold flex items-center">
        <Icon />
        {label}
      </h3>
      {quests?.map((quest) => (
        <QuestCard
          key={quest._id}
          quest={quest}
          userQuest={undefined}
          questCount={undefined}
        />
      ))}
    </div>
  );
};

const QuestCategoryGrid = () => {
  const categories = Object.keys(CATEGORIES);

  return (
    <div className="flex flex-col gap-4">
      {categories.map((category) => (
        <QuestCategoryRow key={category} category={category} />
      ))}
    </div>
  );
};

const SearchResultsGrid = ({ quests }: { quests: Doc<"quests">[] }) => {
  if (!quests) return;

  return (
    <div className="grid">
      {quests.map((quest) => (
        <QuestCard
          key={quest._id}
          quest={quest}
          userQuest={undefined}
          questCount={undefined}
        />
      ))}
    </div>
  );
};

function IndexRoute() {
  const [search, setSearch] = useState("");
  const quests = useQuery(api.quests.getAllActiveQuests);

  const filteredQuests = quests?.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Container className="flex flex-col gap-6 flex-1 overflow-y-auto">
      <PageHeader title="Browse quests">
        <SearchField value={search} onChange={setSearch} />
      </PageHeader>
      {filteredQuests ? (
        <SearchResultsGrid quests={filteredQuests} />
      ) : (
        <QuestCategoryGrid />
      )}
    </Container>
  );
}
