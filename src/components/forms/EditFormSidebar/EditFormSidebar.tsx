import { Select, SelectItem } from "@/components/common";
import { EditFormFields, EditFormPage } from "@/components/forms";
import { api } from "@convex/_generated/api";
import type { Doc, Id } from "@convex/_generated/dataModel";
import { useSearch } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { Heading } from "react-aria-components";

interface PageSelectProps {
  pages?: Doc<"formPages">[] | null;
  selectedPageId?: Id<"formPages">;
}

function PageSelect({ pages, selectedPageId }: PageSelectProps) {
  if (!pages) return "Add page"; // TODO: Button

  return (
    <div className="px-5 py-3">
      <Select label="Page" selectedKey={selectedPageId}>
        {pages?.map((page, index) => (
          <SelectItem
            key={page._id}
            id={page._id}
            href={{ to: ".", search: { page: page._id } }}
          >
            {index + 1} {page.title ?? "Untitled page"}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}

interface EditFormSidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

export function EditFormSidebarSection({
  title,
  children,
}: EditFormSidebarSectionProps) {
  return (
    <section className="px-5 py-4 border-b border-gray-dim flex flex-col gap-3">
      <Heading className="font-medium text-sm m-0 p-0">{title}</Heading>
      <div className="flex flex-col gap-3 pb-2">{children}</div>
    </section>
  );
}

interface EditFormSidebarProps {
  form?: Doc<"forms"> | null;
}

export function EditFormSidebar({ form }: EditFormSidebarProps) {
  const search = useSearch({ strict: false });
  const pages = useQuery(api.formPages.getAllByFormId, {
    formId: form?._id,
  });
  const [selectedPage, setSelectedPage] = useState<
    Doc<"formPages"> | undefined
  >(pages?.filter((page) => page._id === search.page)[0]);

  useEffect(() => {
    setSelectedPage(pages?.filter((page) => page._id === search.page)[0]);
  }, [pages, search.page]);

  return (
    <aside className="w-80 bg-gray-2 dark:bg-graydark-2 flex flex-col border-l border-gray-dim sticky top-0 h-screen overflow-y-auto">
      <PageSelect
        pages={pages}
        selectedPageId={search.page as Id<"formPages">}
      />
      <EditFormPage page={selectedPage} />
      <EditFormFields page={selectedPage} />
    </aside>
  );
}
