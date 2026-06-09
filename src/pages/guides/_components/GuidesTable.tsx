import { useMemo, useState } from "react";
import type { Selection } from "react-aria-components";
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "../../../components/common/Table";
import { Tag, TagGroup } from "../../../components/common/TagGroup";
import "./GuidesTable.css";

export interface Guide {
  id: string;
  title: string;
  state?: string | null;
  category?: string | null;
}

interface GuidesTableProps {
  guides: Guide[];
}

type GroupBy = "all" | "state" | "category";

const getInitialGroupBy = (): GroupBy => {
  if (typeof window === "undefined") return "all";
  const params = new URLSearchParams(window.location.search);
  const group = params.get("group");
  if (group === "state" || group === "category") return group;
  return "all";
};

const sortGuides = (guidesToSort: Guide[]) =>
  [...guidesToSort].sort((a, b) => a.title.localeCompare(b.title));

export function GuidesTable({ guides }: GuidesTableProps) {
  const [groupBy, setGroupBy] = useState<GroupBy>(getInitialGroupBy);

  const handleGroupByChange = (keys: Selection) => {
    if (keys === "all") return;
    const selected = [...keys][0] as GroupBy;
    if (!selected) return;

    setGroupBy(selected);

    const url = new URL(window.location.href);
    if (selected === "all") {
      url.searchParams.delete("group");
    } else {
      url.searchParams.set("group", selected);
    }
    window.history.replaceState({}, "", url);
  };

  const groupedGuides = useMemo(() => {
    if (groupBy === "all") {
      return { All: sortGuides(guides) };
    }

    const groups = new Map<string, Guide[]>();
    for (const guide of guides) {
      const key = guide[groupBy] ?? "Other";
      const existing = groups.get(key) ?? [];
      existing.push(guide);
      groups.set(key, existing);
    }

    const keys = [...groups.keys()];
    if (groupBy === "state") keys.sort();

    const sortedGroups: Record<string, Guide[]> = {};
    for (const key of keys) {
      sortedGroups[key] = sortGuides(groups.get(key) ?? []);
    }
    return sortedGroups;
  }, [guides, groupBy]);

  if (!guides.length) {
    return <p>No guides found.</p>;
  }

  return (
    <div className="guides-table-container">
      <div className="guides-filter-bar">
        <TagGroup
          label="Group by"
          selectionMode="single"
          selectedKeys={[groupBy]}
          onSelectionChange={handleGroupByChange}
          disallowEmptySelection
        >
          <Tag id="all">All</Tag>
          <Tag id="state">State</Tag>
          <Tag id="category">Category</Tag>
        </TagGroup>
      </div>

      {Object.entries(groupedGuides).map(([group, groupGuides]) => (
        <section key={group} className="guides-table-section">
          {groupBy !== "all" && (
            <h2 className="guides-table-heading">{group}</h2>
          )}
          <div className="guides-table-wrapper">
            <Table
              aria-label={groupBy === "all" ? "Guides" : `${group} guides`}
              className="guides-table"
            >
              <TableHeader>
                <Column id="title" isRowHeader>
                  Name
                </Column>
              </TableHeader>
              <TableBody>
                {groupGuides.map((guide) => (
                  <Row key={guide.id}>
                    <Cell>
                      <a href={`/guides/${guide.id}`}>{guide.title}</a>
                    </Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      ))}
    </div>
  );
}
