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
      <Heading
        className="text-4xl font-medium text-gray-normal text-pretty"
        data-section-title
      >
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

function getQuestionId(question: string) {
  let sanitizedQuestion = question;
  // Remove trailing punctuation
  sanitizedQuestion = sanitizedQuestion.replace(/[^\w\s]/g, "");
  // Remove apostrophes
  sanitizedQuestion = sanitizedQuestion.replace(/'/g, "");

  return encodeURIComponent(sanitizedQuestion.toLowerCase().replace(/ /g, "-"));
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
  const id = getQuestionId(title);

  return (
    <section
      id={id}
      data-form-section
      data-testid="form-section"
      className={twMerge(
        "flex flex-col gap-8 p-8 justify-center h-screen snap-center",
        className,
      )}
    >
      <FormHeader title={title} description={description} />
      {children}
    </section>
  );
}
