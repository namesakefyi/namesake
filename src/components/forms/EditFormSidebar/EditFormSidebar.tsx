import { EditFormPage } from "@/components/forms";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Heading } from "react-aria-components";

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
  const pages = useQuery(api.formPages.getAllByFormId, {
    formId: form?._id,
  });

  return (
    <aside className="w-96 bg-gray-2 dark:bg-graydark-2 flex flex-col border-l border-gray-dim sticky top-0 h-screen overflow-y-auto">
      {pages?.map((page) => (
        <EditFormPage key={page._id} page={page} />
      ))}
    </aside>
  );
}
