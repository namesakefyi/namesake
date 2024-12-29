import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Heading } from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { FormField } from "../FormField/FormField";

interface FormHeaderProps {
  /** The question rendered at the top of the page. */
  title?: string;

  /** An optional description to provide more context. */
  description?: string;
}

function FormHeader({ title, description }: FormHeaderProps) {
  return (
    <header className="flex flex-col">
      <Heading className="text-3xl font-medium text-gray-normal">
        {title}
      </Heading>
      {description && <p className="text-lg text-gray-dim">{description}</p>}
    </header>
  );
}

export interface FormPageProps {
  /** Page data. */
  page?: Doc<"formPages">;

  /** The contents of the page. */
  children?: React.ReactNode;

  /** Optional styles for the container. */
  className?: string;
}

export function FormPage({ page, children, className }: FormPageProps) {
  const fields = useQuery(api.formFields.getByIds, {
    fieldIds: page?.fields ?? [],
  });

  return (
    <section
      className={twMerge(
        "flex flex-col p-8 gap-12 border border-gray-dim rounded-xl",
        className,
      )}
    >
      <FormHeader title={page?.title} description={page?.description} />
      {fields?.map((field) => (
        <FormField key={field._id} field={field} />
      ))}
      {children}
    </section>
  );
}
