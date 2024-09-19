import { createFileRoute } from "@tanstack/react-router";
import { useAction } from "convex/react";
import { useEffect, useState } from "react";
import type { Key } from "react-aria";
import Markdown from "react-markdown";
import { useDebouncedCallback } from "use-debounce";
import { api } from "../../../convex/_generated/api";
import { JURISDICTIONS } from "../../../convex/constants";
import type { LawData } from "../../../convex/openlaws";
import {
  Container,
  PageHeader,
  SearchField,
  Select,
  SelectItem,
} from "../../components";

export const Route = createFileRoute("/laws/")({
  component: LawsRoute,
});

function LawsRoute() {
  const getLaws = useAction(api.openlaws.getLaws);

  const [laws, setLaws] = useState<LawData[] | null | undefined>(null);
  const [jurisdiction, setJurisdiction] = useState<JURISDICTIONS | null>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const searchLaws = () => {
    if (jurisdiction === null || query === null) return;

    getLaws({
      jurisdiction: jurisdiction,
      query: query,
    }).then((res) => {
      setLaws(res);
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: This is correct
  useEffect(() => {
    searchLaws();
  }, [debouncedQuery, jurisdiction]);

  const debouncedSearch = useDebouncedCallback(() => {
    setDebouncedQuery(query);
  }, 1000);

  const handleUpdateQuery = (value: string) => {
    setQuery(value);
    debouncedSearch();
  };

  const handleUpdateJurisdiction = (value: Key) => {
    setJurisdiction(value as JURISDICTIONS);
  };

  const Laws = () => {
    if (laws === undefined) return "Loading";
    if (laws === null || laws.length === 0) return "No laws found";

    return (
      <>
        {laws.map((law) => (
          <div key={law.identifier}>
            <h2 className="text-xl mt-4">{law.name}</h2>
            {law.label}
            <a href={law.source_url}>{law.source_url}</a>
            <Markdown className="prose dark:prose-invert">
              {law.markdown_content}
            </Markdown>
          </div>
        ))}
      </>
    );
  };

  return (
    <Container>
      <PageHeader title="Laws" />
      <div className="flex gap-4">
        <Select
          label="Jurisdiction"
          placeholder="Select a jurisdiction"
          selectedKey={jurisdiction}
          onSelectionChange={handleUpdateJurisdiction}
        >
          {Object.entries(JURISDICTIONS).map(([value, label]) => (
            <SelectItem key={value} id={value}>
              {label}
            </SelectItem>
          ))}
        </Select>
        <SearchField
          value={query}
          onChange={handleUpdateQuery}
          label="Keyword"
        />
      </div>
      <div className="pt-4">
        <Laws />
      </div>
    </Container>
  );
}
