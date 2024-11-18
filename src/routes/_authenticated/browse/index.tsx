import {
  AppSidebar,
  Badge,
  Button,
  Card,
  Container,
  Link,
  PageHeader,
  SearchField,
} from "@/components";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { CATEGORIES, type Category } from "@convex/constants";
import { RiLoader4Line, RiQuestionLine } from "@remixicon/react";
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
  const [isAdding, setIsAdding] = useState(false);
  const addQuest = useMutation(api.userQuests.create);

  const handleAddQuest = () => {
    setIsAdding(true);
    addQuest({ questId: quest._id })
      .then(() => {
        toast.success(`Added ${quest.title} quest`);
      })
      .then(() => setIsAdding(false));
  };

  const CallToAction = ({
    userQuest,
  }: {
    userQuest: Doc<"userQuests"> | null | undefined;
  }) => {
    if (!userQuest) {
      return (
        <Button
          variant="primary"
          onPress={handleAddQuest}
          isDisabled={isAdding}
          aria-label={isAdding ? "Adding" : "Add quest"}
        >
          {isAdding ? <RiLoader4Line className="animate-spin" /> : "Add quest"}
        </Button>
      );
    }

    return (
      <Link
        href={{ to: "/quests/$questId", params: { questId: quest._id } }}
        button={{ variant: "secondary" }}
      >
        Go to quest
      </Link>
    );
  };

  return (
    <Card className="flex flex-col gap-4 justify-between w-64 shrink-0">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          {quest.title}
          {quest.jurisdiction && <Badge>{quest.jurisdiction}</Badge>}
        </div>
        <p className="text-gray-dim">{`${questCount ?? 0} user${questCount === 1 ? "" : "s"}`}</p>
      </div>
      <CallToAction userQuest={userQuest} />
    </Card>
  );
};

const QuestCategoryRow = ({ category }: { category: Category }) => {
  const quests = useQuery(api.quests.getAllQuestsInCategory, {
    category: category,
  });

  const userQuests = useQuery(api.userQuests.getUserQuestsByQuestIds, {
    questIds: quests?.map((q) => q._id) ?? [],
  });

  const questCounts = useQuery(api.userQuests.getQuestCounts, {
    questIds: quests?.map((q) => q._id) ?? [],
  });

  if (!quests || quests.length === 0) return;

  const { label, icon } = CATEGORIES[category as Category];
  const Icon = icon ?? RiQuestionLine;

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-gray-dim font-semibold flex gap-2 items-center py-2">
        <Icon size={16} />
        {label}
      </h3>
      <div className="w-full flex flex-wrap gap-4 pb-4 overflow-x-auto">
        {quests?.map((quest) => {
          const userQuest = userQuests?.find((uq) => uq.questId === quest._id);
          const questCount = questCounts?.find(
            (qc) => qc.questId === quest._id,
          )?.count;

          return (
            <QuestCard
              key={quest._id}
              quest={quest}
              userQuest={userQuest}
              questCount={questCount}
            />
          );
        })}
      </div>
    </div>
  );
};

const QuestCategoryGrid = () => {
  const categories = Object.keys(CATEGORIES) as Category[];

  return (
    <div className="flex flex-col gap-4">
      {categories.map((category) => (
        <QuestCategoryRow key={category} category={category as Category} />
      ))}
    </div>
  );
};

const SearchResultsGrid = ({
  quests,
}: { quests: Doc<"quests">[] | undefined }) => {
  if (!quests) return;

  return (
    <div className="flex flex-wrap items-center gap-4">
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
    <Container className="flex gap-6">
      <AppSidebar>
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search quests"
        />
      </AppSidebar>
      <div className="w-full">
        <PageHeader title="Browse quests" />
        {filteredQuests && search !== "" ? (
          <SearchResultsGrid quests={filteredQuests} />
        ) : (
          <QuestCategoryGrid />
        )}
      </div>
    </Container>
  );
}
