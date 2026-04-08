import { useMemo, useState } from "react";
import type { Selection, SortDescriptor } from "react-aria-components";
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "@/components/react/common/Table";
import { Tag, TagGroup } from "@/components/react/common/TagGroup";
import type { GUIDES_INDEX_QUERY_RESULT } from "@/sanity/sanity.types";
import "./GuidesTable.css";

export type Guide = GUIDES_INDEX_QUERY_RESULT[number];

interface GuidesTableProps {
  guides: GUIDES_INDEX_QUERY_RESULT;
}

type GroupBy = "all" | "state" | "category";

const getInitialGroupBy = (): GroupBy => {
  if (typeof window === "undefined") return "all";
  const params = new URLSearchParams(window.location.search);
  const group = params.get("group");
  if (group === "state" || group === "category") return group;
  return "all";
};

export function GuidesTable({ guides }: GuidesTableProps) {
  const [groupBy, setGroupBy] = useState<GroupBy>(getInitialGroupBy);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "title",
    direction: "ascending",
  });

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    dateStyle: "medium",
  });

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
    const sortGuides = (guidesToSort: Guide[]) => {
      return [...guidesToSort].sort((a, b) => {
        let cmp: number;
        if (sortDescriptor.column === "title") {
          cmp = (a.title ?? "").localeCompare(b.title ?? "");
        } else {
          const dateA = a._updatedAt ? new Date(a._updatedAt).getTime() : 0;
          const dateB = b._updatedAt ? new Date(b._updatedAt).getTime() : 0;
          cmp = dateA - dateB;
        }
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      });
    };

    if (groupBy === "all") {
      return { All: sortGuides(guides) };
    }

    // Use Map to preserve insertion order (order from Sanity)
    const groups = new Map<string, Guide[]>();
    for (const guide of guides) {
      const key = guide[groupBy] ?? "Other";
      const existing = groups.get(key) ?? [];
      existing.push(guide);
      groups.set(key, existing);
    }

    // For states, sort alphabetically; for categories, preserve Sanity order
    const keys = [...groups.keys()];
    if (groupBy === "state") {
      keys.sort();
    }

    const sortedGroups: Record<string, Guide[]> = {};
    for (const key of keys) {
      sortedGroups[key] = sortGuides(groups.get(key) ?? []);
    }
    return sortedGroups;
  }, [guides, groupBy, sortDescriptor]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return formatter.format(new Date(dateString));
  };

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
              sortDescriptor={sortDescriptor}
              onSortChange={setSortDescriptor}
            >
              <TableHeader>
                <Column id="title" isRowHeader allowsSorting>
                  Name
                </Column>
                <Column id="updated" allowsSorting style={{ width: "0px" }}>
                  Updated
                </Column>
              </TableHeader>
              <TableBody>
                {groupGuides.map((guide) => (
                  <Row key={guide.slug.current}>
                    <Cell>
                      <a href={`/guides/${guide.slug?.current}`}>
                        {guide.title ?? ""}
                      </a>
                    </Cell>
                    <Cell>{formatDate(guide._updatedAt)}</Cell>
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
