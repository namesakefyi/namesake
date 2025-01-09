import { smartquotes } from "@/helpers/smartquotes";
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
    <header className="flex flex-col gap-2">
      <Heading className="text-4xl font-medium text-gray-normal text-pretty">
        {smartquotes(title)}
      </Heading>
      {description && (
        <p className="text-xl text-gray-dim text-pretty">
          {smartquotes(description)}
        </p>
      )}
    </header>
  );
}

export interface FormSectionProps extends FormHeaderProps {
  /** The contents of the page. */
  children?: React.ReactNode;

  /** Optional styles for the container. */
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <section
      className={twMerge(
        "flex flex-col gap-8 py-8 justify-center h-screen snap-center",
        className,
      )}
    >
      <FormHeader title={title} description={description} />
      {children}
    </section>
  );
}
