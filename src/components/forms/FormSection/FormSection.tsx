import { smartquotes } from "@/utils/smartquotes";
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
        className="text-3xl font-medium text-gray-normal text-pretty"
        data-section-title
      >
        {smartquotes(title)}
      </Heading>
      {description && (
        <p className="text-lg text-gray-dim text-pretty">
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
  return (
    <fieldset
      id={getQuestionId(title)}
      data-form-section
      data-testid="form-section"
      className={twMerge("flex flex-col gap-8 py-12 justify-center", className)}
    >
      <FormHeader title={title} description={description} />
      {children}
    </fieldset>
  );
}

interface FormSubsectionProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
  isVisible?: boolean;
}

export function FormSubsection({
  title,
  children,
  className,
  isVisible = true,
}: FormSubsectionProps) {
  if (!isVisible) return null;

  return (
    <fieldset
      className={twMerge(
        "flex flex-col gap-8 pl-6 py-2 border-l-3 border-gray-a3 justify-center",
        className,
      )}
      disabled={!isVisible}
    >
      {title && (
        <Heading className="text-2xl font-medium text-gray-normal text-pretty">
          {smartquotes(title)}
        </Heading>
      )}
      {children}
    </fieldset>
  );
}
