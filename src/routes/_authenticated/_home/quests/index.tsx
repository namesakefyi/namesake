import { PageHeader } from "@/components/app";
import { SearchField } from "@/components/common";
import { QuestGrid } from "@/components/quests";
import { api } from "@convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { useState } from "react";
import { useDebounce } from "use-debounce";

export const Route = createFileRoute("/_authenticated/_home/quests/")({
  component: QuestsRoute,
});

function QuestsRoute() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const activeQuests = useQuery(api.quests.getAllActive);
  const filteredQuests = useQuery(api.quests.search, { query: debouncedQuery });

  const quests = debouncedQuery ? filteredQuests : activeQuests;

  return (
    <>
      <PageHeader title="Browse">
        <SearchField
          placeholder="Search Namesake"
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-64"
        />
      </PageHeader>
      <div className="app-padding">
        <QuestGrid quests={quests ?? []} />
      </div>
    </>
  );
}
