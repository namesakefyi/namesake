import { Heading } from "react-aria-components";
import { twMerge } from "tailwind-merge";

interface FormHeaderProps {
  /** The question rendered at the top of the page. */
  title: string;

  /** An optional description to provide more context. */
  description?: string;
}

function FormHeader({ title, description }: FormHeaderProps) {
  return (
    <header className={"flex flex-col"}>
      <Heading className="text-2xl font-semibold text-gray-normal">
        {title}
      </Heading>
      {description && <p className="text-base text-gray-dim">{description}</p>}
    </header>
  );
}

export interface FormPageProps extends FormHeaderProps {
  /** The contents of the page. */
  children?: React.ReactNode;

  /** Optional styles for the container. */
  className?: string;
}

export function FormPage({
  title,
  description,
  children,
  className,
}: FormPageProps) {
  return (
    <section className={twMerge("flex flex-col gap-4", className)}>
      <FormHeader title={title} description={description} />
      {children}
    </section>
  );
}
